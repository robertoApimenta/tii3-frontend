import React, { useState, useEffect } from 'react';
import './App.css';
import api from './Api/api';

import { Alert, Button, Col, Container, Form, Input, Row, Table } from 'reactstrap';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {

  const [projeto, setProjeto] = useState('');
  const [programador, setProgramador] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [cargo, setCargo] = useState('');
  const [valorHora, setValorHora] = useState('');
  const [qtdeHora, setQtdeHora] = useState('');

  const [dados, setDados] = useState([]);

  const [status, setStatus] = useState('');

  const [projetoDeletado, setProjetoDeletado] = useState('');

  useEffect(() => {
    async function pegaProjetos() {
      let dados = await api.get('/listar-projetos');
      setDados(dados.data.dados);
    };

    pegaProjetos();
  }, []);

  async function pegaProjetos() {
    let dados = await api.get('/listar-projetos');
    setDados(dados.data.dados);
  };

  async function deletarProjeto(_id) {
    let id = _id;
    await api.delete('/deletarProjeto/' + id).then((res) => {
      setProjetoDeletado(res.data.deletado.projeto);
      setStatus(3);
      pegaProjetos();
    }).catch(() => {
      setStatus(4);
    });
  };

  async function cadastrarProjeto(e) {
    e.preventDefault();
    let dados = {
      projeto,
      programador,
      supervisor,
      cargo,
      valorHora,
      qtdeHora
    };
    await api.post('/novo-projeto', dados).then(() => {
      pegaProjetos();
      setProjeto('');
      setProgramador('');
      setSupervisor('');
      setCargo('');
      setValorHora('');
      setQtdeHora('');
      setStatus(1);
    }).catch((err) => {
      console.log(err)
      setStatus(2);
    })
  };

  return (
    <Container className="text-center">
      {status === 1 ? <Alert color="success">Projeto cadastrado com sucesso.</Alert> : ''}
      {status === 2 ? <Alert color="danger">Erro durante tentativa de cadastro, contate o administrador do sistema.</Alert> : ''}
      {status === 3 ? <Alert color="success">Projeto {projetoDeletado} foi deletado com sucesso.</Alert> : ''}
      {status === 4 ? <Alert color="danger">Erro durante tentativa de exclusão, contate o administrador do sistema.</Alert> : ''}
      <h4 className="m-4">Cadastro de projetos</h4>
      <hr></hr>
      <Form onSubmit={cadastrarProjeto}>
        <Row>
          <Col xl="2" md="4" sm="12" className="mt-1" >
            <Input
              required
              type="text"
              placeholder="Digite o projeto"
              value={projeto}
              onChange={e => setProjeto(e.target.value)}
            />
          </Col>
          <Col xl="2" md="4" sm="12" className="mt-1">
            <Input
              required
              type="text"
              placeholder="Digite o programador"
              value={programador}
              onChange={e => setProgramador(e.target.value)}
            />
          </Col>
          <Col xl="2" md="4" sm="12" className="mt-1">
            <Input
              required
              type="text"
              placeholder="Digite o supervisor"
              value={supervisor}
              onChange={e => setSupervisor(e.target.value)}
            />
          </Col>
          <Col xl="2" md="4" sm="12" className="mt-1">
            <Input
              required
              type="text"
              placeholder="Digite o cargo"
              value={cargo}
              onChange={e => setCargo(e.target.value)}
            />
          </Col>
          <Col xl="2" md="4" sm="12" className="mt-1">
            <Input
              required
              type="text"
              placeholder="Digite o R$ hora"
              value={valorHora}
              onChange={e => setValorHora(e.target.value)}
            />
          </Col>
          <Col xl="2" md="4" sm="12" className="mt-1">
            <Input
              required
              type="text"
              placeholder="Digite a qtde de horas"
              value={qtdeHora}
              onChange={e => setQtdeHora(e.target.value)}
            />
          </Col>
        </Row>
        <div className="mt-4 text-center">
          <Button color="primary" type="submit">Cadastrar</Button>
        </div>
      </Form>
      <hr></hr>
      <div>
        <Table
          responsive
          striped
          hover
          stickyHeader
        >
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Programador</th>
              <th>Supervisor</th>
              <th>Cargo</th>
              <th>(R$) valor da hora</th>
              <th>Quantidade de horas</th>
              <th>Deletar</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((row) => (
              <tr
                key={row._id}
              >
                <td>{row.projeto}</td>
                <td>{row.programador}</td>
                <td>{row.supervisor}</td>
                <td>{row.cargo}</td>
                <td>{row.valorHora}</td>
                <td>{row.qtdeHora}</td>
                <td>
                  <IconButton
                    onClick={() => {
                      deletarProjeto(row._id)
                    }}
                    color="primary"
                    aria-label="upload picture"
                    component="span">
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default App;
