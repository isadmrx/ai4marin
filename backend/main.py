from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI4Marin Backend")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Dependency to get current user from token
def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(models.User).filter(models.User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@app.post("/register/{role}", response_model=schemas.UserRead)
def register(role: str, user: schemas.UserCreate, db: Session = Depends(get_db)):
    if role not in {"shipowner", "crew", "vendor"}:
        raise HTTPException(status_code=400, detail="Invalid role")
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=get_password_hash(user.password),
        role=role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access = create_access_token({"sub": str(user.id), "role": user.role})
    refresh = create_refresh_token({"sub": str(user.id)})
    return schemas.Token(access_token=access, refresh_token=refresh)


@app.post("/token/refresh", response_model=schemas.Token)
def refresh_token(refresh_token: str):
    payload = decode_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    access = create_access_token({"sub": payload.get("sub")})
    new_refresh = create_refresh_token({"sub": payload.get("sub")})
    return schemas.Token(access_token=access, refresh_token=new_refresh)


@app.post("/ships", response_model=schemas.ShipRead)
def create_ship(
    ship: schemas.ShipCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "shipowner":
        raise HTTPException(status_code=403, detail="Not a shipowner")
    db_ship = models.Ship(**ship.dict(), owner_id=current_user.id)
    db.add(db_ship)
    db.commit()
    db.refresh(db_ship)
    return db_ship


@app.get("/ships", response_model=schemas.ShipList)
def list_ships(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "shipowner":
        raise HTTPException(status_code=403, detail="Not a shipowner")
    ships = db.query(models.Ship).filter(models.Ship.owner_id == current_user.id).all()
    return {"ships": ships}


@app.get("/ships/{ship_id}", response_model=schemas.ShipRead)
def get_ship(
    ship_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ship = (
        db.query(models.Ship)
        .filter(models.Ship.id == ship_id, models.Ship.owner_id == current_user.id)
        .first()
    )
    if not ship:
        raise HTTPException(status_code=404, detail="Ship not found")
    return ship
