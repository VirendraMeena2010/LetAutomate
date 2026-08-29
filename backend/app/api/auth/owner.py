from fastapi import APIRouter,status,HTTPException,Depends
from app.model.user import User
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.core.security import hash_password,verify_password,create_access_token,get_current_user
from app.schemas.user import UserResponse,UserCreate,UserLogin,TokenResponse,OwnerMeResponse

owner_router = APIRouter(tags=["Owner"])

@owner_router.post("/create_owner",status_code=status.HTTP_201_CREATED, response_model=UserResponse)
async def create_owner(user:UserCreate,db:Session=Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400,bad_request="Email already registered")
    hashed_password = hash_password(user.password)
    db_user = User(full_name=user.full_name,email=user.email,password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



@owner_router.post(
    "/login_owner",
    response_model=TokenResponse,
)
async def login_owner(
    user_login: UserLogin,
    db: Session = Depends(get_db),
):
    # Find user by email
    db_user = (
        db.query(User)
        .filter(User.email == user_login.email)
        .first()
    )

    # Validate credentials
    if (
        not db_user
        or not verify_password(
            user_login.password,
            db_user.password_hash,
        )
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password",
        )

    # Create JWT
    access_token = create_access_token(
        data={
            "sub": str(db_user.user_id),
        }
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=db_user,
    )




@owner_router.get(
    "/me",
    response_model=OwnerMeResponse,
)
def get_current_owner_profile(
    current_owner=Depends(get_current_user),
):
    """
    Return the currently authenticated owner.

    Authentication:
        Requires a valid owner JWT.

    The owner is identified from the JWT.
    The frontend does not send user_id.
    """

    if current_owner is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Owner authentication required",
        )

    return current_owner