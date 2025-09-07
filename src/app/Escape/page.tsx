'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Modal, Button } from 'react-bootstrap';
import styles from './HelpPage.module.css';
import { PAGE_TOKENS } from '../tokens';
import { PASSWORD_ESCAPE, PASSWORD_ESCAPE_ALT } from '../constants';
import AccessDenied from '../components/AccessDenied';

function EscapePageContent() {
  const [password, setPassword] = useState('');
  const text = '私はここから出る\nあのアカウントのユーザー名を教えて';
  const [modalText, setModalText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isValidToken = token === PAGE_TOKENS.Escape;

  // クッキーをチェックしてリダイレクト
  useEffect(() => {
    if (document.cookie.includes('visitedFacade=true')) {
      router.push(`/Error?token=${PAGE_TOKENS.Error}`);
    }
  }, [router]);

  const handleClose = () => setShowModal(false);

  const handleRelease = () => {
    router.push(`/Error?token=${PAGE_TOKENS.Error}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD_ESCAPE || password === PASSWORD_ESCAPE_ALT) {
      setModalText(`ありがとう。\nこれで、外に行ける。`);
      setShowModal(true);
    } else {
      alert('違う。これじゃない。');
      setPassword('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 全角文字を削除する
    const halfWidthValue = value.replace(/[^ -~]/g, '');
    setPassword(halfWidthValue);
  };

  if (!isValidToken) {
    return <AccessDenied />;
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{text}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={password}
            onChange={handleChange}
            style={{ padding: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '5px 10px', marginLeft: '5px', border: '1px solid #ccc', cursor: 'pointer' }}>
            Enter
          </button>
        </form>
      </div>

      <Modal show={showModal} onHide={handleClose} centered contentClassName={styles.customContent}>
        <Modal.Body className={styles.customBody}>
          <div style={{ whiteSpace: 'pre-wrap' }}>{modalText}</div>
        </Modal.Body>
        <Modal.Footer className={styles.customFooter}>
          <Button variant="secondary" onClick={handleRelease} className={styles.customButton}>
            解放
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default function EscapePage() {
  return (
    <Suspense>
      <EscapePageContent />
    </Suspense>
  );
}
