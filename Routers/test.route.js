import { createPhonePePayment, getPhonePeToken } from "../Controller/payment.controller.js";
import {AllData,writeFile,generateToken} from "../Controller/test.controller.js"
import Express from "express"
export const router = Express.Router();

router.route("/test/all-data").get(AllData);
router.route("/test/create").post(writeFile);
router.route("/generateToken").post(generateToken)
router.route("/user/get-phonepe-token").get(getPhonePeToken); // Assuming
router.route("/phonepe/create-payment").post(createPhonePePayment);
// router.route("/phonepe/status/:merchantTransactionId").get(checkPhonePeStatus);

//route_package.(jis url per chelana hai).method=get,post,put,delete(jis module chelana hai is route per thik h)
export default router;