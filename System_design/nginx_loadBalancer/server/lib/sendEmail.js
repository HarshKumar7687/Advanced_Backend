const sendEmail = async(email)=>{
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Email sent successfully!");
            resolve();
        }, 5000);
    });
    console.log("Task Completed");
}

export default sendEmail;