const PDFDocument = require("pdfkit");
const fs = require("fs");

const generatePDF = (transactions, filePath, user, account) => {
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(fs.createWriteStream(filePath));

    doc
        .fontSize(20)
        .text("Apni BANK LTD", { align: "center" })
        .moveDown(1);

    doc.fontSize(12);
    doc.text(`Account No : ${account.accountNo}`);
    doc.text(`Name       : ${user.name}`);
    doc.text(`Email      : ${user.email}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    
    const tableTop = doc.y + 10;
    const colX = {
        sr: 50,
        type: 70,
        from: 150,
        to: 240,
        amount: 320,
        date: 390   
    };

    doc.fontSize(12).text("Sr", colX.sr, tableTop);
    doc.text("Type", colX.type, tableTop);
    doc.text("From", colX.from, tableTop);
    doc.text("To", colX.to, tableTop);
    doc.text("Amount", colX.amount, tableTop);
    doc.text("Date", colX.date, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();


    let y = tableTop + 25;

    transactions.forEach((txn, index) => {
        doc.text(index + 1, colX.sr, y);
        doc.text(txn.type, colX.type, y);
        doc.text(txn.fromAccount || "-", colX.from, y);
        doc.text(txn.toAccount || "-", colX.to, y);
        doc.text(`Rs.${txn.amount}`, colX.amount, y);
        doc.text(
            new Date(txn.createdAt).toLocaleString(),
            colX.date,
            y,
            { width: 130 }
        );

        y += 25;

        // Page break
        if (y > 700) {
            doc.addPage();
            y = 50;
        }
    });


    doc.moveDown(2);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc
        .fontSize(14)
        .text(`Current Balance : Rs.${account.balance}`, {
            align: "right"
        });

    doc.end();
};

module.exports = generatePDF