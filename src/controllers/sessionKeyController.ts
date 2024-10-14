import { Request, Response } from "express";
import { config } from "../config";
import { RemoteSignerMode, toRemoteSigner } from "@zerodev/remote-signer";
import { toECDSASigner } from "@zerodev/permissions/signers";
import { StatusCodes } from "http-status-codes";
// import { createPublicClient, Hex, http } from "viem";
// import { base, baseSepolia } from "viem/chains";
// import { createKernelAccountClient, createZeroDevPaymasterClient, SponsorUserOperationParameters } from "@zerodev/sdk";
// import { deserializePermissionAccount } from "@zerodev/permissions";
// import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless'
// import { ENTRYPOINT_ADDRESS_V06_TYPE } from "permissionless/_types/types";

// const BUNDLER_RPC = `https://rpc.zerodev.app/api/v2/bundler/${config.ZERODEV_ID}`;
// const PAYMASTER_RPC = `https://rpc.zerodev.app/api/v2/paymaster/${config.ZERODEV_ID}`;

// async function getAuthorizedUser(req: Request): Promise<string | null> {
//     //auth logic
// }

const createRemoteSigner = async() : Promise<void> => {
    const remoteSigner = await toRemoteSigner({
        apiKey: config.ZERODEV_API_KEY,
        mode: RemoteSignerMode.Create,
    });

    const sessionKeySigner = toECDSASigner({
        signer: remoteSigner,
    });

    const sessionKeyAddress = sessionKeySigner.account.address;
    config.ZERODEV_REMOTE_SIGNER_ADDRESS = sessionKeyAddress;
}

export const initRemoteSigner = async (req: Request, res: Response): Promise<void> => {
    try {
        // const userId = await getAuthorizedUser(req);
        // if (!userId) {
        //     res.status(401).json({ error: 'Unauthorized.' });
        //     return;
        // }

        // Call to create a remote signer
        await createRemoteSigner()

        const remoteSigner = await toRemoteSigner({
            apiKey: config.ZERODEV_API_KEY,
            keyAddress: config.ZERODEV_REMOTE_SIGNER_ADDRESS as `0x${string}`,
            mode: RemoteSignerMode.Get,
        });

        const sessionKeySigner = toECDSASigner({
            signer: remoteSigner,
        });

        const sessionKeyAddress = sessionKeySigner.account.address;

        res.status(StatusCodes.OK).json({
            session_key_address: sessionKeyAddress
        });

    } catch (error) {
        console.error(`Error creating remote signer: ${error}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to create remote signer'
        });
    }
};


// export const registerSessionKey = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const {session_key_approval : sessionKeyApproval} = req.body;

//         if (typeof sessionKeyApproval !== 'string') {
//             res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
//                 error: 'Invalid session key approval.'
//             });
//             return;
//         }

//         res.status(StatusCodes.OK).json({});

//     } catch (error) {
//         console.error(`Error registering session key: ${error}`);
//         res.status(500).json({ error: 'Failed to register session key' });
//     }
// };


// export const sendTransaction = async (req: Request, res: Response): Promise<void> => {
//     try {
//         // const authHeader = req.headers.authorization?.replace('Basic ', '');
//         // if (!authHeader) {
//         //     return res.status(401).json({ error: 'Authorization header missing.' });
//         // }

//         // const [, appSecret] = Buffer.from(authHeader, 'base64').toString().split(':');
//         // if (appSecret !== process.env.MY_APP_BACKEND_ADMIN_TOKEN) {
//         //     return res.status(401).json({ error: 'Invalid app secret.' });
//         // }


//         const remoteSigner = await toRemoteSigner({
//             apiKey: config.ZERODEV_API_KEY,
//             keyAddress: config.ZERODEV_REMOTE_SIGNER_ADDRESS as `0x${string}`,
//             mode: RemoteSignerMode.Get
//         });

//         const sessionKeySigner = toECDSASigner({
//             signer: remoteSigner
//         });

//         const publicClient = createPublicClient({
//             transport: http(baseSepolia.rpcUrls.default.http[0]),
//         });

//         const sessionKeyAccount = await deserializePermissionAccount(
//             publicClient,
//             ENTRYPOINT_ADDRESS_V06,
//             "0.2.4",
//             approval,
//             sessionKeySigner
//         )

//         // const kernelClient = createKernelAccountClient({
//         //     account: sessionKeyAccount,
//         //     chain: baseSepolia,
//         //     entryPoint: ENTRYPOINT_ADDRESS_V06,
//         //     bundlerTransport: http(process.env.NEXT_PUBLIC_ZERODEV_BUNDLER_URL),
//         // });

//         const kernelClient = createKernelAccountClient({
//             account: sessionKeyAccount,
//             chain: base,
//             entryPoint: ENTRYPOINT_ADDRESS_V06,
//             bundlerTransport: http(BUNDLER_RPC),
//             middleware: {
//               sponsorUserOperation: async ({ userOperation }) => {
//                 const paymasterClient = createZeroDevPaymasterClient({
//                   chain:base,
//                   transport: http(PAYMASTER_RPC),
//                   entryPoint: ENTRYPOINT_ADDRESS_V06,
//                 });
//                 const _userOperation =
//                   userOperation as SponsorUserOperationParameters<ENTRYPOINT_ADDRESS_V06_TYPE>["userOperation"];
//                 return paymasterClient.sponsorUserOperation({
//                   userOperation: _userOperation,
//                   entryPoint: ENTRYPOINT_ADDRESS_V06,
//                 });
//               },
//             },
//         });

//         const userOpHash: Hex = await kernelClient.sendUserOperation({
//             userOperation: {
//               callData: await kernelClient.account.encodeCallData({
//                 to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//                 value: BigInt(0),
//                 data: ethers.hexlify(transferData) as Hex,
//               }),
//             },
//           });

//         const transactionHash = await kernelClient.sendTransaction({
//             to: "0x...",  // Replace with the recipient's wallet address
//             value: parseEther('1'),
//         });

//         console.log("Transaction Hash:", transactionHash);
//         res.status(200).json({ transaction_hash: transactionHash });

//     } catch (error) {
//         console.error(`Error sending transaction: ${error}`);
//         res.status(500).json({ error: 'Failed to send transaction' });
//     }
// };


