'use strict';

const supertest = require('supertest');
const app = require('../../app');

const auth = {
  // General token for the test script
  token: '',

  // FOR SIGNUP endpoint - fill in values into the provided variables. NOTE: Change the values everytime you run the test script/file(using "npm test apiRoutes.test.js")

  // SIGNUP
  signupOtions: {
    first_name: 'fill a first name here',
    last_name: 'fill a last name here',
    email: 'fill an email here',
    password: 'fill a password here',
  },

  // FOR LOGIN endpoint
  loginOptions: [
    { email: 'john@doe.io', password: 'culbreg78' },
    { email: 'jane@doe.io', password: 'cryonics1#' },
    { email: 'markings@outlook.io', password: 'yingyang44' },
  ],

  //*NOTE */
  // change this value to select a user above; 0 selects John, 1 selects Jane, 2 selects markings and so on
  loginValue: 0,

  // CREATE A BLOG endpoint - You can fill out all fields as you please, put the ones with (!important) tags has to be different everytime you run the script/file
  createABlog: {
    title: 'Removing Dirt from the Enviroment',
    description: 'attention i might need you to facefront',
    tags: 'Environment',
    body: 'Kept in sent gave feel will oh it we. Has pleasure procured men laughing shutters nay. Old insipidity motionless continuing law shy partiality. Depending acuteness dependent eat use dejection. Unpleasing astonished discovered not nor shy. Morning hearted now met yet beloved evening.',
  },

  // GET A BLOG endpoint - No BIG need to alter this it can remain constant.
  getABlogID: '63652d587aa3ed6f5c8ac4af',

  // for testing the "UPDATE MY BLOGS" & "DELETE MY BLOGS" api endpoints, appending this ID into the available field completes the endpoints' of both URL with an ID.
  blogToUpdateAndDeleteId:
    "fill with an id from the options below -- (discard after use: it'll be deleted)",

  // options of ID to choose from - take ID from below and fill it into the field.
  blogToUpdateAndDeleteIdOptions: [
    { John: '63652b80e3fcbf87f4d90219' },
    { jane: '63652db17aa3ed6f5c8ac4bb' },
    { Markings: '636529efac49d32e1b20ce8f' },
  ],

  // ********  ATTENTION! ATTENTION!! ATTENTION!!! **********//

  // ********  whoever is logged in, should have his/her ID in the "blogToUpdateAndDeleteId" field, as this makes sure a user, a logged in user can only update or delete their own blog and not another, FOR INSTANCE if MARKINGS is logged in with his email and passpord as included in the loginOptions object, then the blogToUpdateAndDeleteId field MUST contain MARKINGS ID as included in the options (please fill only the ID "636529efac49d32e1b20ce8f" and not the object {name : id}) **********//
};

// ********  JEST TEST CODES START HERE, DON'T ALTER OR ELSE YOU KNOW WHAT YOU'RE DOING. **********//

function loginUser(email, password) {
  return async () => {
    const user = {
      email: email,
      password: password,
    };

    const res = await supertest(app).post('/api/v1/users/login').send(user);
    auth.token = res.body.token;
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(user.email);
  };
}

describe('user routes', () => {
  it('signup', async () => {
    const user = {
      first_name: auth.signupOtions.first_name,
      last_name: auth.signupOtions.last_name,
      email: auth.signupOtions.email,
      password: auth.signupOtions.password,
      role: 'admin',
    };

    const res = await supertest(app).post('/api/v1/users/signup').send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.user.first_name).toBe(user.first_name);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.user.role).toBe('admin');
  });

  it('login', loginUser(auth.sigup_email, auth.signup_password));

  it('get all users', async () => {
    const res = await supertest(app)
      .get('/api/v1/users/')
      .set('Authorization', `Bearer ${auth.token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data.users)).toBe(true);
  });
});

describe('blog routes', () => {
  it(
    'login',
    loginUser(
      auth.loginOptions[auth.loginValue].email,
      auth.loginOptions[auth.loginValue].password
    )
  );

  it('get all blogs', async () => {
    const res = await supertest(app).get('/api/v1/blogs');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.blogs)).toBe(true);
  });

  it('get a Blog', async () => {
    const res = await supertest(app).get(`/api/v1/blogs/${auth.getABlogID}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.blog._id).toBe(auth.getABlogID);
  });

  it('create a blog', async () => {
    const blog = {
      title: auth.createABlog.title,
      description: auth.createABlog.description,
      tags: auth.createABlog.tags,
      body: auth.createABlog.body,
    };
    const res = await supertest(app)
      .post('/api/v1/blogs')
      .set('Authorization', `Bearer ${auth.token}`)
      .send(blog);

    expect(res.status).toBe(201);
    expect(res.body.data.blog.title).toBe(blog.title);
    expect(Array.isArray(res.body.data.blog.tags)).toBe(true);
  });

  it('get user blogs', async () => {
    const res = await supertest(app)
      .get('/api/v1/blogs/myBlogs')
      .set('Authorization', `Bearer ${auth.token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data.blogs)).toBe(true);
  });

  it('update user blog', async () => {
    const blog = {
      state: 'published',
    };
    const res = await supertest(app)
      .patch(`/api/v1/blogs/myBlogs/${auth.blogToUpdateAndDeleteId}`)
      .set('Authorization', `Bearer ${auth.token}`)
      .send(blog);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.blog.state).toBe(blog.state);
  });

  it('delete user blog', async () => {
    const res = await supertest(app)
      .delete(`/api/v1/blogs/myBlogs/${auth.blogToUpdateAndDeleteId}`)
      .set('Authorization', `Bearer ${auth.token}`);

    expect(res.statusCode).toEqual(204);
    expect(res.body.data).toBe(undefined);
  });
});

/****** END *******/
