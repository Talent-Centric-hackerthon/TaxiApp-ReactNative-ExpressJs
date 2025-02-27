import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../../app';
import DriverModal from '../../../models/driver';
import { driver } from '../../mocks/dummy';
import { urlPrefix } from '../../mocks/variable';
import {
   HTTP_ACCESS_DENIED,
   HTTP_CREATED,
   HTTP_EXIST,
   HTTP_OK,
   HTTP_SERVER_ERROR,
   HTTP_NOT_FOUND,
   HTTP_BAD_REQUEST
} from '../../../core/constants/httpStatus';
import baseEnvCall from '../../../envCall/index';
import { expect } from 'chai';

beforeAll(async () => {
   const url = `${baseEnvCall.MONGODB_URI_TEST}`;
   await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   });
   await DriverModal.deleteMany();
});

describe('Test driver API', () => {
   test('Should register the driver with email and password,etc...', (done) => {
      request(app)
         .post(`${urlPrefix}/auth/driver/create`)
         .send(driver)
         .end((err, response) => {
            expect(response.status).equal(HTTP_CREATED);
            done();
         });
   });
   test('Should not register the driver without email and password,etc...', (done) => {
      request(app)
         .post(`${urlPrefix}/auth/driver/create`)
         .send({
            email: '',
            password: '',
         })
         .end((err, response) => {
            expect(response.status).equal(HTTP_BAD_REQUEST);
            done();
         });
   });
   test('Should login  the driver with email and password', (done) => {
      request(app)
         .post(`${urlPrefix}/auth/driver/login`)
         .send({
            email: driver.email,
            password: driver.password,
         })
         .end((err, response) => {
            expect(response.status).equal(HTTP_OK);
            done();
         });
   });
   test('Should not login  the driver without email and password', (done) => {
      request(app)
         .post(`${urlPrefix}/auth/driver/login`)
         .send({
            email: '',
            password: '',
         })
         .end((err, response) => {
            expect(response.status).equal(HTTP_SERVER_ERROR || HTTP_NOT_FOUND);
            done();
         });
   });
});
afterAll(async () => {
   await DriverModal.deleteMany();
});