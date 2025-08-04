from pydantic import BaseModel, EmailStr
from typing import List, Optional


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class ShipBase(BaseModel):
    name: str
    imo_number: str
    type: str
    flag: str
    year_built: int


class ShipCreate(ShipBase):
    pass


class ShipRead(ShipBase):
    id: int

    class Config:
        orm_mode = True


class ShipList(BaseModel):
    ships: List[ShipRead]
