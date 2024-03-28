from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

class User(BaseModel):
    username: str
    email: str
    phone: str

@app.get("/users/")
def read_from_file():
    user_data_list = []
    try:
        with open('users.txt', 'r') as file:
            for line in file:
                user_data = json.loads(line)
                user = User(username=user_data['username'], email=user_data['email'], phone=user_data['phone'])
                user_data_list.append(user)
    except FileNotFoundError:
        pass
    print("User data list:", user_data_list) 
    return user_data_list


def write_to_file(user_data_list):
    with open('users.txt', 'w') as file:
        for user in user_data_list:
            user_data = {
                'username': user.username,
                'email': user.email,
                'phone': user.phone
            }
            file.write(json.dumps(user_data) + '\n')

@app.post("/register/")
def register_user(user: User):
    existing_users = read_from_file()

    if any(u.username == user.username or u.email == user.email for u in existing_users):
        raise HTTPException(status_code=400, detail="Username or email already exists")

    existing_users.append(user)

    write_to_file(existing_users)

    return {"message": "User registered successfully"}

@app.get("/usernames/")
def get_usernames():
    user_data_list = read_from_file()
    usernames = [user.username for user in user_data_list]
    return {"usernames": usernames}

@app.get("/emails/")
def get_emails():
    user_data_list = read_from_file()
    emails = [user.email for user in user_data_list]
    return {"emails": emails}

@app.get("/phones/")
def get_phones():
    user_data_list = read_from_file()
    phones = [user.phone for user in user_data_list]
    return {"phones": phones}
