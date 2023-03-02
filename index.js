const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const s3Client = new S3Client({ region: "eu-west-3", apiVersion: "2006-03-01" });
const snsClient = new SNSClient({ region: "eu-west-3", apiVersion: "2010-03-31" });

const getListOfBuckets = async () => {
  console.log("Retrieving the list of buckets...")
  const cmd = new ListBucketsCommand({});
  const response = await s3Client.send(cmd);

  let formattedMsg = "";

  response.Buckets.forEach(bucket => {
    formattedMsg += `${bucket.Name} created on ${bucket.CreationDate}\n`
  });

  console.log("Done!")
  return formattedMsg;
};

const publishSNSMessage = async (message) => {
  console.log("Publishing the message to SNS topic")
  const input = {
    TopicArn: "arn:aws:sns:eu-west-3:458213628860:demo-cloud9-topic",
    Message: message,
    Subject: "This is a demo message"
  };

  const cmd = new PublishCommand(input);
  await snsClient.send(cmd);
  console.log("Done!")
};

(async () => {
  const buckets = await getListOfBuckets();
  await publishSNSMessage(buckets);
})()

