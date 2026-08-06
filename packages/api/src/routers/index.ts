import { aiRouter } from "../features/ai/router";
import { authRouter } from "../features/auth/router";
import { flagsRouter } from "../features/flags/router";
import { paymentRouter } from "../features/payment/router";
import { resumeRouter } from "../features/resume/router";
import { statisticsRouter } from "../features/statistics/router";
import { storageRouter } from "../features/storage/router";

export default {
	ai: aiRouter,
	auth: authRouter,
	flags: flagsRouter,
	payment: paymentRouter,
	resume: resumeRouter,
	statistics: statisticsRouter,
	storage: storageRouter,
};
