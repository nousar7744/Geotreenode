import Express from "express";
import { Checkuser, login, OtpVerify } from "../Controller/signup.controller.js";
import { createPhonePePayment, phonePeRedirect, phonePeCallback, checkPaymentStatus } from "../Controller/payment.controller.js";

export const Auth = Express.Router();

Auth.post("/user/check-user", Checkuser);
Auth.post("/user/login", login);
Auth.post("/user/verify", OtpVerify);
Auth.post("/phonepe/create-payment", createPhonePePayment);
Auth.post("/phonepe/redirect", phonePeRedirect);
Auth.post("/phonepe/callback", phonePeCallback);
Auth.get("/phonepe/status/:transactionId", checkPaymentStatus);
