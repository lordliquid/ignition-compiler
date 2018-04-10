const config = {
  inPath:
    'C:/Ignition/ignition-sdk-examples/home-connect-example/hce-build/target/HomeConnectExample-unsigned.modl',
  outPath:
    'C:/Ignition/ignition-sdk-examples/home-connect-example/hce-build/target/HomeConnectExample-unsigned.modl',
  signerPath: `java -jar C:/Ignition/module-signer.jar -keystore=C:/keystore.jks -keystore-pwd=az789456 -alias=test -alias-pwd=az789456 -chain=C:/test.p7b -module-in=C:/Ignition/ignition-sdk-examples/home-connect-example/hce-build/target/HomeConnectExample-unsigned.modl -module-out=C:/Ignition/ignition-sdk-examples/home-connect-example/hce-build/target/HomeConnectExample-unsigned.modl`
};

const exec = require('child_process').exec;
exec(config.signerPath, (error, stdout, stderr) => {
  if (error instanceof Error) {
    console.error('stderr', stderr);
    throw error;
  }
  console.log('stdout', stdout);
});
