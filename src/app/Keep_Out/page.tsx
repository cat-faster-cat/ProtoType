"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import { KeyFill } from 'react-bootstrap-icons';
import { PAGE_TOKENS } from '../tokens';
import styles from './PasswordPage.module.css';
import { PASSWORD_KEEP_OUT } from '../constants';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleHintClose = () => setShowHint(false);
  const handleHintShow = () => setShowHint(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD_KEEP_OUT) {
      router.push(`/Contact?token=${PAGE_TOKENS.Contact}`);
    } else {
      setError('パスワードが違います。');
      setPassword('');
    }
  };

  return (
    <>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row>
          <Col>
            <div className="text-center">
              <h1 className="mb-4">関係者以外立入禁止</h1>
              <p>パスワードを入力</p>
            </div>
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '320px' }}>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Enter
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>

      <Button
        variant="secondary"
        className={styles.downloadButton}
        aria-label="Show Hint"
        onClick={handleHintShow}
      >
        <KeyFill />
      </Button>

      <Modal show={showHint} onHide={handleHintClose} centered>
        <Modal.Body className="text-center">
          変換前の文字列
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleHintClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}