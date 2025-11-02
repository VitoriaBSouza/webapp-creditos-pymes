import { useState, useMemo } from 'react';

//CSS files
import './LoanAmount.css';
import Button from '@/components/Button/Button';

export default function LoanAmount() {
  const [amount, setAmount] = useState(15000);
  const [months, setMonths] = useState(84);
  const [showDetails, setShowDetails] = useState(false);
  const TAE = 5.99; // fixed TAE

  // Monthly payment
  const monthlyPayment = useMemo(() => {
    const monthlyRate = TAE / 100 / 12;
    if (monthlyRate === 0) return amount / months;
    return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  }, [amount, months]);

  // Total repayment and interest
  const totalRepayment = useMemo(() => monthlyPayment * months, [monthlyPayment, months]);
  const totalInterest = useMemo(() => totalRepayment - amount, [totalRepayment, amount]);

  return (
    <div className="row p-4 pt-5 pb-0 m-0 fs-5">
      {/* Card column */}
      <div className="col-lg-8 mb-3 mt-4">
        <div className="card loan-card p-4">
          {/* Monto */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <label className="fw-semibold">Quiero recibir:</label>
              <div className="input-box">{amount.toLocaleString()} €</div>
            </div>
            <input
              type="range"
              className="form-range custom-range"
              min="1000"
              max="50000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="d-flex justify-content-between text-muted small">
              <span>1.000 €</span>
              <span>50.000 €</span>
            </div>
          </div>

          {/* Plazo */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <label className="fw-semibold">Devolverlo en:</label>
              <div className="input-box">{months} meses</div>
            </div>
            <input
              type="range"
              className="form-range custom-range"
              min="12"
              max="96"
              step="12"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            />
            <div className="d-flex justify-content-between text-muted small">
              <span>12 meses</span>
              <span>96 meses</span>
            </div>
          </div>

          {/* Resultados */}
          <div className="d-flex justify-content-around border-top pt-3">
            <div className="text-center">
              <div className="small text-muted">Cuota mensual</div>
              <div className="fw-bold fs-5">{monthlyPayment.toFixed(2)} €/mes</div>
            </div>
            <div className="text-center">
              <div className="small text-muted">TAE</div>
              <div className="fw-bold fs-6">{TAE} %</div>
            </div>
          </div>

          {/* Más detalles toggle */}
          <div className="text-center mt-3 m-0">
            <p
              className="text-success fw-bold text-center text-decoration-none"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                setShowDetails(!showDetails);
              }}
            >
              Más detalles
            </p>
          </div>

          {/* Detalles calculados */}
          {showDetails && (
            <div className="mt-3 border-top pt-3 text-start small">
              <div className="d-flex justify-content-between">
                <div><strong>Principal:</strong> {amount.toLocaleString()} €</div>
                <div><strong>Plazo:</strong> {months} meses</div>
              </div>
              <div className='text-center mt-3 mb-1'><strong>Cuota mensual:</strong> {monthlyPayment.toFixed(2)} €</div>
              <div className='text-center m-0'><strong>Total a pagar:</strong> {totalRepayment.toFixed(2)} €</div>
              <div className='fs-5 text-center m-0'><strong>Intereses totales:</strong> {totalInterest.toFixed(2)} €</div>
            </div>
          )}
        </div>
      </div>

      {/* Button column */}
      <div className="col-lg-3 d-flex align-items-center justify-content-between mb-3">
        <Button
          text="Solicitar ahora mismo"
          color="teal"
          size="xl"
          action="register"
        />
      </div>
    </div>

  );
}
