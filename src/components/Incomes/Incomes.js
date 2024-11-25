import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  ListGroup,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import SidebarNav from "../SidebarNav/SidebarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faArrowCircleLeft,
  faArrowCircleRight,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

function Incomes() {
  const [incomes, setIncomes] = useState(() => {
    const savedIncomes = localStorage.getItem("incomes");
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [incomesPerPage] = useState(5);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Salário", "Extras", "Investimento", "Outros"];

  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "Incomes.xlsx");
  };

  const handleEdit = (income) => {
    setEditing(true);
    setCurrentIncome(income);
    setName(income.name);
    setAmount(income.amount);
    setDate(income.date);
    setDescription(income.description);
    setIsPaid(income.status === "PAID");
    setCategory(income.category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !date || !description || !category) {
      alert("Todos os campos são obrigatórios, incluindo a categoria.");
      return;
    }
    const isConfirmed = window.confirm(
      editing
        ? "Tem certeza de que deseja atualizar esta entrada?"
        : "Tem certeza de que deseja adicionar esta entrada?"
    );
    if (!isConfirmed) {
      return;
    }

    const incomeData = {
      id: editing ? currentIncome.id : Date.now(),
      name,
      amount,
      date,
      description,
      status: isPaid ? "PAGO" : "ABERTO",
      category,
    };

    if (editing) {
      setIncomes(
        incomes.map((income) =>
          income.id === currentIncome.id ? incomeData : income
        )
      );
    } else {
      setIncomes([...incomes, incomeData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setAmount("");
    setDate("");
    setDescription("");
    setIsPaid(false);
    setEditing(false);
    setCurrentIncome(null);
    setCategory("");
  };

  const handleRemove = (id) => {
    const isConfirmed = window.confirm(
      "Tem certeza de que deseja remover esta entrada?"
    );
    if (isConfirmed) {
      setIncomes(incomes.filter((income) => income.id !== id));
    }
  };

  const totalIncome = incomes.reduce(
    (total, income) => total + parseFloat(income.amount),
    0
  );

  const filteredIncomes =
    searchQuery.length > 0
      ? incomes.filter(
          (income) =>
            income.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            income.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (income.category?.toLowerCase() || "").includes(
              searchQuery.toLowerCase()
            )
        )
      : incomes;

  // Pagination logic
  const indexOfLastIncome = currentPage * incomesPerPage;
  const indexOfFirstIncome = indexOfLastIncome - incomesPerPage;
  const currentIncomes = filteredIncomes.slice(
    indexOfFirstIncome,
    indexOfLastIncome
  );

  // Change page function
  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      prev * incomesPerPage < filteredIncomes.length ? prev + 1 : prev
    );
  };

  const chartData = {
    labels: incomes.map((income) => new Date(income.date)),
    datasets: [
      {
        label: "Total Income",
        data: incomes.map((income) => income.amount),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Income (€)",
        },
      },
    },
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
        <Col md={10} className="main">
          {/* <BreadcrumbAndProfile
            pageTitle="Incomes"
            breadcrumbItems={[
              { name: "Painel", path: "/dashboard", active: false },
              { name: "Entradas", path: "/incomes", active: true },
            ]}
          /> */}
          {/* <InputGroup className="mb-3">
            <FormControl
              placeholder="Search incomes..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup> */}
          <Row>
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 20 }} // Initial state: transparent and slightly below its final position
                animate={{ opacity: 1, y: 0 }} // Animate to: fully opaque and in its final position
                transition={{ duration: 0.5, delay: 0.2 }} // Customize the duration and add a delay if desired
              >
                <Card className="mt-3 total">
                  <Card.Body>
                    <Card.Title>Total Entradas</Card.Title>
                    <Card.Text>Total: R$ {totalIncome.toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* <Col md={6}>
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            </Col> */}
          </Row>

          <Form onSubmit={handleSubmit}>
            <Row className="grid-row">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome da Entrada"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição Curta"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Valor da Entrada"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="grid-row">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Selecione uma Categoria</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-center">
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Pago"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="mt-3 primary-button">
              {editing ? "Atualizar Entrada" : "Adicionar Entrada"}
              <FontAwesomeIcon icon={faPlusCircle} className="icon-right" />
            </Button>
          </Form>

          <ListGroup className="mt-3">
            {filteredIncomes.map((income) => (
              <ListGroup.Item key={income.id} className="list-group-item">
                <div className="expense-details">
                  {`${income.name} - Valor: R$ ${income.amount} - Data: ${
                    income.date
                  } - Tipo: ${income.description} - Categoria: ${
                    income.category || "Não especificado"
                  } - Status: ${income.status}`}
                </div>
                <div className="button-group">
                  <Button
                    className="edit"
                    size="sm"
                    onClick={() => handleEdit(income)}
                    style={{ marginRight: "5px" }}
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="icon-left"
                    />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemove(income.id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="icon-left" />
                    Remover
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* <Button onClick={exportToExcel} className="mt-3 excel-button">
            <FontAwesomeIcon icon={faFileExcel} className="icon-left" /> Export
            to Excel
          </Button> */}

          {/* Pagination Controls */}
          {/* <div className="d-flex justify-content-between mt-3">
            <Button
              onClick={handlePreviousPage}
              className="page"
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} />
            </Button>
            <Button
              onClick={handleNextPage}
              className="page"
              disabled={currentPage * incomesPerPage >= incomes.length}
            >
              <FontAwesomeIcon icon={faArrowCircleRight} />
            </Button>
          </div> */}
        </Col>
      </Row>
    </Container>
  );
}

export default Incomes;
