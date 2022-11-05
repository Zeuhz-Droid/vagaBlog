# **vagaBlog**

This is an API for a Blogging App.

## Requirements

- Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
- A user should be able to sign up and sign in into the blog app
- Use JWT as authentication strategy and expire the token after 1 hour
- A blog can be in two states; draft and published
- Logged in and not logged in users should be able to get a list of published blogs created
- Logged in and not logged in users should be able to to get a published blog
- Logged in users should be able to create a blog.
- When a blog is created, it is in draft state
- The owner of the blog should be able to update the state of the blog to published
- The owner of a blog should be able to edit the blog in draft or published state
- The owner of the blog should be able to delete the blog in draft or published state
- The owner of the blog should be able to get a list of their blogs.
  - The endpoint should be paginated
  - It should be filterable by state
- Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
- The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated,
  - default it to 20 blogs per page.
  - It should also be searchable by author, title and tags.
  - It should also be orderable by read_count, reading_time and timestamp
- When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
- Come up with any algorithm for calculating the reading_time of the blog.
- Write tests for all endpoints

## Setup

- Install NodeJS, mongodb
- pull this repo
- update `env` with example.env
- run `npm run start:dev`

---

## Base URL

### User

| field      | data_type | constraints                                      |
| ---------- | --------- | ------------------------------------------------ |
| id         | string    | required                                         |
| first_name | string    | required                                         |
| last_name  | string    | required                                         |
| full_name  | string    | optional                                         |
| email      | string    | required                                         |
| password   | string    | required                                         |
| role       | string    | optional, default: user, enum: ['user', 'admin'] |

### Blog

| field        | data_type | constraints                                             |
| ------------ | --------- | ------------------------------------------------------- |
| id           | string    | required                                                |
| timestamp    | date      | required                                                |
| title        | string    | required                                                |
| description  | string    | optional                                                |
| tags         | array     | optional                                                |
| author       | ref       | required                                                |
| body         | string    | required                                                |
| read_count   | number    | optional, default: 0                                    |
| reading_time | string    | optional,                                               |
| state        | string    | required, enum default: 'draft', ['draft', 'published'] |

### Signup User

- Route: /api/v1/users/signup
- Method: POST
- Body:

```JavaScript
{
    "first_name":"John",
    "last_name":"Dickson",
    "email":"dickson@yahoo.com",
    "password": "diskcon627",
    "role": "user"
}
```

- Responses

Success

```JavaScript
{
    "status": "success",
    "data": {
        "user": {
            "first_name": "John",
            "last_name": "Dickson",
            "email": "dickson@yahoo.com",
            "role": "user",
            "_id": "63652ebfb1dca37cdb7f5f0a",
            "full_name": "john dickson",
        }
    }
}
```

---

### Login User

- Route: /api/v1/users/login
- Method: POST
- Body:

```JavaScript
{
  "email": "dickson@yahoo.com",
  "password": 'diskcon627',
}
```

- Responses

Success

```JavaScript
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ij...",
    "data": {
        "user": {
            "first_name": "John",
            "last_name": "Dickson",
            "email": "dickson@yahoo.com",
            "role": "user",
            "full_name": "john dickson",
        }
    }
}
```

### Get All Blogs

- Route: /api/v1/blogs
- Method: GET
- Body:

- Query params:

  - state (published)
  - page (default: 1)
  - per_page (default: 20)
  - search by (options: tags | author | title)
  - order_by (default: read_count reading_time timestamp)
  - order (options: asc | desc, default: desc)

- Responses

Success

```JavaScript
[
    {Object 1},
    {
        "_id": "63652d587aa3ed6f5c8ac4af",
        "title": "Saponification: Production of Soap",
        "description": "Production of benzene from the mixture of H2, CH4 and toluene",
        "tags": [
            "chemistry",
            "organic compound",
            "chemical compound"
        ],
        "author": {
            "_id": "63652c017aa3ed6f5c8ac4a5",
            "email": "jane@doe.io",
            "role": "user",
            "full_name": "jane doe"
        },
        "state": "published",
        "read_count": 5,
        "body": "Saponification is a process that involves the conversion of fat, oil, or lipid, into soap and...",
        "timestamp": "2022-11-04T15:12:10.960Z",
        "authorInfo": "Jane Doe",
        "reading_time": "2 mins",
    },
    {Object 3},
    ...otherObjects
]
```

### Get A Blog

- Route: /api/v1/blogs/:id
- Method: GET
- Body:

- Query params:

  - search by (id)
  - state (published)
  - timestamp

- Responses

Success

```JavaScript
{
    "_id": "63652b25e3fcbf87f4d90210",
    "title": "Gentridue Indulgence",
    "description": "Making AI in the lightest means can be considered deadly in the long run because...",
    "tags": [
        "Artificial Intelligence",
        "soft AI",
        "hard AI"
    ],
    "author": {
        "_id": "63652a9fe3fcbf87f4d90208",
        "email": "john@doe.io",
        "role": "user",
        "full_name": "john doe"
    },
    "state": "published",
    "read_count": 1,
    "body": "Denote simple fat denied add worthy little use. As some he so high down am week...",
    "timestamp": "2022-11-04T15:06:12.028Z",
    "authorInfo": "John Doe",
    "reading_time": "1 mins",
}
```

### Create A Blog

- Route: /api/v1/blogs/
- Method: POST
- Body:

```JavaScript
{
    "title": "Ring light in the dark",
    "description": "Production of paper from wood e.g softwood or hardwood",
    "tags": ["paper", "pulp", "chemical compound"],
    "body": "Lorem Ipsum comes from a latin text written in 45BC by Roman statesman, lawyer, scholar..."
}
```

- Header:
  - Authorization: Bearer {token}
- Query params: nil

- Responses

Success

```JavaScript
{
    "title": "Ring light in the dark",
    "description": "Production of paper from wood e.g softwood or hardwood",
    "tags": [
        "paper",
        "pulp",
        "chemical compound"
    ],
    "author": "63652ebfb1dca37cdb7f5f0a",
    "state": "draft",
    "read_count": 0,
    "body": "Lorem Ipsum comes from a latin text written in 45BC by Roman statesman, lawyer, scholar...",
    "timestamp": "2022-11-04T15:39:14.470Z",
    "_id": "6365328c8ffc71a75f0fa9d3",
    "authorInfo": "John Dickson",
    "reading_time": "3 mins",
}
```

### Get My Blogs

- Route: /api/v1/blogs/myBlogs
- Method: GET
- Body:

- Header:
  - Authorization: Bearer {token}
- Query params:

  - page (default: 1)
  - per_page (default: 20)
  - state (options: draft | published)

- Responses

Success

```JavaScript
[
    {Object 1},
    {
        "title": "Gentridue Indulgence",
        "description": "Making AI in the lightest means can be considered deadly in the long run because...",
        "tags": [
            "Artificial Intelligence","soft AI", "hard AI" ],
        "author": {
            "email": "john@doe.io",
            "role": "user",
            "full_name": "john doe"
        },
        "state": "published",
        "read_count": 1,
        "body": "Denote simple fat denied add worthy little use. As some he so high down am week...",
        "timestamp": "2022-11-04T15:06:12.028Z",
        "authorInfo": "John Doe",
        "reading_time": "1 mins",
    },
    {Object 3},
    {
        "title": "Piano playing is in",
        "description": "A big part of wood making is the art of usoing a nails is getting set up with the basics that involve the partitioning...",
        "tags": ["music", "piano","instrument", "sound"],
        "author": {
            "email": "john@doe.io",
            "role": "user",
            "full_name": "john doe"
        },
        "state": "draft",
        "read_count": 0,
        "body": "Denote simple fat denied add worthy little use. As some he so high down am week. Conduct esteems by cottage...",
        "timestamp": "2022-11-04T15:06:12.028Z",
        "authorInfo": "John Doe",
        "reading_time": "1 mins",
    }
]
```

### Update My Blog

- Route: /api/v1/blogs/myBlogs/:id
- Method: GET
- Body:

```JavaScript
{
    "state" : "published",
}
```

- Header:

  - Authorization: Bearer {token}

- Query params:

  - id
  - state (options: draft | published)

- Responses

Success

```Javascript
{
    "_id": "63652b80e3fcbf87f4d90219",
    "title": "Piano playing is in",
    "description": "A big part of wood making is the art of usoing a nails is getting set up with the basics that involve the partitioning...",
    "tags": ["music", "piano","instrument", "sound"],
    "author": {
        "email": "john@doe.io",
        "role": "user",
        "full_name": "john doe"
    },
    "state": "published",
    "read_count": 0,
    "body": "Denote simple fat denied add worthy little use. As some he so high down am week. Conduct esteems by cottage...",
    "timestamp": "2022-11-04T15:06:12.028Z",
    "authorInfo": "John Doe",
    "reading_time": "1 mins",
}
```

<!-- NA HERE YOU DEY, YOU DEY WRITE THE FIELDS WEY PLAUSIBLE, COPY FROM GITHUB, AND ALSO CORRECT SIGNUP USER WEY DEY SEND TOKEN -->

## API TESTING

This includes functions used to test the API routes/endpoints,

- The _auth_ object is used to control the whole test functions in the apiRoutes.test.js file, READ THE COMMENTS INCLUDED IN THIS FILE FOR DETAILS ABOUT THE TEST APIROUTES FILE,

```JavaScript

const auth = {};

```

- change into the test\integration folder using `cd <filename\child_file>` and run this code in the terminal.

```
    npm run test apiRoutes.test.js
```
