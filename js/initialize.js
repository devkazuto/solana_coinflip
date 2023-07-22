import * as anchor from '@project-serum/anchor';
import {
    PublicKey,
    Transaction,
} from '@solana/web3.js';
import web3 from '@solana/web3.js';
import fs from 'fs';
(async () => {

    let secretKey = Uint8Array.from([177,22,10,199,207,223,148,248,20,105,177,21,102,212,165,249,110,150,102,220,96,76,255,220,197,8,115,231,231,141,77,68,200,0,42,247,104,119,141,57,25,174,238,26,121,132,206,105,121,169,68,91,94,140,161,190,202,222,193,56,193,206,3,189]);
  
    const myKeypair = web3.Keypair.fromSecretKey(secretKey);

    const IDL = JSON.parse(fs.readFileSync('./coinflip.json'));
    const PROGRAM_ID = new PublicKey(
        "5c8peVydgwwwPH46AyzQxTTBzTRrH5cta7xq6FG8Fp52"
    );
    
    const connection = new web3.Connection(
        "https://api.devnet.solana.com ",
        'confirmed',
      );

    let provider = new anchor.AnchorProvider(
        connection,
        myKeypair,
        anchor.AnchorProvider.defaultOptions()
    );
    const program = new anchor.Program(IDL, PROGRAM_ID, provider);

    const transaction = new Transaction().add(
        await program.methods
            .initialize()
            .accounts({
                admin: myKeypair.publicKey,
                globalState: await getGlobalStateKey(myKeypair.publicKey),
            })
            .instruction()
    );
    

    transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = myKeypair.publicKey;
    // const signedTransaction = await web3.sen(transaction);
    // const rawTransaction = signedTransaction.serialize();

    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [myKeypair],
      );

    console.log(signature);
      
    // const txid = await connection.sendRawTransaction(
    //     rawTransaction,
    //     {
    //         skipPreflight: true,
    //         preflightCommitment: "processed",
    //     }
    // );
})()