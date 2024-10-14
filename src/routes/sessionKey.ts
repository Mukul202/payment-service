import { Router } from "express";
import { initRemoteSigner, registerSessionKey, sendTransaction } from "../controllers/sessionKeyController";

const router = Router();

router.post('/init', initRemoteSigner);
router.post('/register', registerSessionKey);
router.post('/rpc', sendTransaction);

export const sessionKeyRoutes = router;
