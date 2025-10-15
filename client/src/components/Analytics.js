import React, { useState } from "react";
import { Card, Progress, Row, Col } from "antd";


const incomeCategories = ["salary", "tip", "project", "other"];
const expenseCategories = ["tip", "movie","food","bills","medical","project","fee","tax","other"];

const Analytics = ({ allTransaction }) => {
  const [filterType] = useState("all");

  if (!allTransaction || allTransaction.length === 0) {
    return (
      <div className="text-center mt-4 text-muted">
        <h4>No transactions to analyze</h4>
      </div>
    );
  }

  const filteredTransactions =
    filterType === "all"
      ? allTransaction
      : allTransaction.filter((t) => t.type === filterType);

  const totalTransaction = filteredTransactions.length;
  const totalIncomeTransaction = filteredTransactions.filter((t) => t.type === "income");
  const totalExpenseTransaction = filteredTransactions.filter((t) => t.type === "expense");

  const totalIncomePercent = totalTransaction > 0 ? (totalIncomeTransaction.length / totalTransaction) * 100 : 0;
  const totalExpensePercent = totalTransaction > 0 ? (totalExpenseTransaction.length / totalTransaction) * 100 : 0;

  const totalTurnover = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncomeTurnover = totalIncomeTransaction.reduce((acc, t) => acc + t.amount, 0);
  const totalExpenseTurnover = totalExpenseTransaction.reduce((acc, t) => acc + t.amount, 0);

  const incomeTurnoverPercent = totalTurnover > 0 ? (totalIncomeTurnover / totalTurnover) * 100 : 0;
  const expenseTurnoverPercent = totalTurnover > 0 ? (totalExpenseTurnover / totalTurnover) * 100 : 0;

  return (
    <div className="analytics-container">

      

      {/* Summary Cards */}
      <Row gutter={[16, 16]} justify="center">
        {/* Transactions */}
        <Col xs={24} md={12} lg={8}>
          <Card className="shadow-md rounded-xl text-center">
            <h4 className="section-title gradient-text mb-3">Total Transactions</h4>
            <h5>{totalTransaction} overall</h5>
            <div className="d-flex justify-content-around mt-3">
              <div className="text-center">
                <h6 className="text-success">Income</h6>
                <h5>{totalIncomeTransaction.length}</h5>
                <Progress type="circle" strokeColor="green" percent={totalIncomePercent.toFixed(0)} size={80} />
              </div>
              <div className="text-center">
                <h6 className="text-danger">Expense</h6>
                <h5>{totalExpenseTransaction.length}</h5>
                <Progress type="circle" strokeColor="red" percent={totalExpensePercent.toFixed(0)} size={80} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Turnover */}
        <Col xs={24} md={12} lg={8}>
          <Card className="shadow-md rounded-xl text-center">
            <h4 className="section-title gradient-text mb-3">Total Turnover</h4>
            <h5>₹{totalTurnover.toFixed(2)}</h5>
            <div className="d-flex justify-content-around mt-3">
              <div className="text-center">
                <h6 className="text-success">Income</h6>
                <h5>₹{totalIncomeTurnover.toFixed(2)}</h5>
                <Progress type="circle" strokeColor="green" percent={incomeTurnoverPercent.toFixed(0)} size={80} />
              </div>
              <div className="text-center">
                <h6 className="text-danger">Expense</h6>
                <h5>₹{totalExpenseTurnover.toFixed(2)}</h5>
                <Progress type="circle" strokeColor="red" percent={expenseTurnoverPercent.toFixed(0)} size={80} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Net Balance */}
        <Col xs={24} md={12} lg={8}>
          <Card className="shadow-md rounded-xl text-center">
            <h4 className="section-title gradient-text mb-3">Net Balance</h4>
            <h2 className={totalIncomeTurnover - totalExpenseTurnover >= 0 ? "text-success" : "text-danger"}>
              ₹{(totalIncomeTurnover - totalExpenseTurnover).toFixed(2)}
            </h2>
            <p className="text-muted mt-2">
              {totalIncomeTurnover - totalExpenseTurnover >= 0 ? "You're saving money! 💰" : "You're overspending! ⚠️"}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Income Analysis */}
      {filterType !== "expense" && (
        <>
          <h4 className="mt-5 mb-3 text-center gradient-text">Income Analysis</h4>
          <Row gutter={[16, 16]} justify="center">
            {incomeCategories.map((cat) => {
              const amount = allTransaction
                .filter((t) => t.type === "income" && t.category === cat)
                .reduce((acc, t) => acc + t.amount, 0);
              const percent = totalIncomeTurnover > 0 ? (amount / totalIncomeTurnover) * 100 : 0;
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={cat}>
                  <Card className="text-center">
                    <h6>{cat}</h6>
                    <Progress percent={percent.toFixed(0)} strokeColor="green" size="small" />
                    <p>₹{amount.toFixed(2)}</p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}

      {/* Expense Analysis */}
      {filterType !== "income" && (
        <>
          <h4 className="mt-5 mb-3 text-center gradient-text">Expense Analysis</h4>
          <Row gutter={[16, 16]} justify="center">
            {expenseCategories.map((cat) => {
              const amount = allTransaction
                .filter((t) => t.type === "expense" && t.category === cat)
                .reduce((acc, t) => acc + t.amount, 0);
              const percent = totalExpenseTurnover > 0 ? (amount / totalExpenseTurnover) * 100 : 0;
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={cat}>
                  <Card className="text-center">
                    <h6>{cat}</h6>
                    <Progress percent={percent.toFixed(0)} strokeColor="red" size="small" />
                    <p>₹{amount.toFixed(2)}</p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}

      <style jsx>{`
        .analytics-container {
          padding-bottom: 40px;
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .text-success {
          color: #16a34a !important;
        }
        .text-danger {
          color: #dc2626 !important;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .gradient-text {
          background: linear-gradient(90deg, #2563eb, #16a34a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Analytics;
