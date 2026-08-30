export const sendMockEmailNotification = async (
  email: string,
  subject: string,
  body: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate network latency for sending email
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Log the email representation to the server/console
  console.log('----------------------------------------------------');
  console.log('📧 [MOCK EMAIL SERVICE INITIATED]');
  console.log(`📡 Status: Sent Successfully`);
  console.log(`👤 Recipient: ${email}`);
  console.log(`📝 Subject: ${subject}`);
  console.log(`✉️ Message Body:`);
  console.log(body);
  console.log('----------------------------------------------------');

  return {
    success: true,
    message: `Email successfully sent to ${email}`,
  };
};
