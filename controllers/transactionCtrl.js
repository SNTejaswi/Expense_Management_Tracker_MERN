import transactionModel from '../models/transactionModel.js';
import moment from 'moment';

// Get all transactions
export const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, userid, type } = req.body;

    let filter = { userid };

    // Filter by type if provided
    if (type && type !== "all") {
      filter.type = type;
    }

    if (frequency !== "all" && frequency !== "custom") {
      // Last 7, 30, 365 days
      filter.date = { $gte: moment().subtract(Number(frequency), "days").toDate() };
    } else if (frequency === "custom" && selectedDate.length === 2) {
      // Custom range
      filter.date = {
        $gte: new Date(selectedDate[0]),
        $lte: new Date(moment(selectedDate[1]).endOf("day").toISOString())
      };
    }

    const transactions = await transactionModel.find(filter).sort({ date: -1 });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};


// Add transaction
export const addTransaction = async (req, res) => {
  try {
    const { userid, amount, type, category, reference, description, date } = req.body;

    const newTransaction = new transactionModel({
      userid,
      amount,
      type,
      category,
      reference,
      description,
      date: new Date(date).toISOString(), // ensures UTC format
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
export const editTransaction =async (req,res)=>{
try{
  await transactionModel.findOneAndUpdate({_id:req.body.transactionId},
    req.body.payload
  );
  res.status(200).send("Edit Successfully Done")
}catch(error){
  console.log(error)
  res.status(500).json(error)

}
}
export const deleteTransaction=async(req,res)=>{
  try{
      await transactionModel.findOneAndDelete({_id:req.body.transactionId}),

      res.status(200).send("Transaction Deleted Successfully");
  }catch(error){
    console.log(error);
    res.status(500).json(error)
  }
}