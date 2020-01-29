import React, { useState, useEffect } from 'react';
import { PREProxy } from 'ideafast-pre';
import style from './Element.module.css';

type ProxyProps = {
    proxy: Proxy;
    onClose?: (id: number) => void;
}

const Proxy: React.FC<ProxyProps> = ({ proxy, onClose }) => {

    const { id } = proxy;
    const [receipientPk, setReceipientPk] = useState('');
    const [reEncryptionKey, setReEncryptionKey] = useState('');
    const [transformableSecret, setTransformableSecret] = useState('');
    const [transformedSecret, setTransformedSecret] = useState('');

    useEffect(() => {
        if (transformableSecret === '' || reEncryptionKey === '' || receipientPk === '') {
            setTransformedSecret('');
            return;
        }
        try {
            const secret = Buffer.from(transformableSecret, 'base64');
            const reKey = Buffer.from(reEncryptionKey, 'base64');
            const pk = Buffer.from(receipientPk, 'base64');
            setTransformedSecret(PREProxy.reEnc(secret, reKey, pk)[1]?.toString('base64') ?? '');
        } catch (e) {
            setTransformedSecret(`Could not compute transformed secret: ${e?.message}`);
        }
    }, [transformableSecret, reEncryptionKey, receipientPk])

    const handleReceipientPk = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const pk = event.target.value;
        setReceipientPk(pk);
    }

    const handleReEncryptionKey = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const rek = event.target.value;
        setReEncryptionKey(rek);
    }

    const handleTransformableSecret = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const secret = event.target.value;
        setTransformableSecret(secret);
    }

    return (
        <div className={style.wrapper} >
            <span className={style.title}>Proxy #{id}&nbsp;&nbsp;&nbsp;<button onClick={() => onClose?.(id)}>Delete</button></span><br />
            <span className={style.section}>Sender Public Key</span>
            <textarea className={style.code} onChange={handleReceipientPk} value={receipientPk} />
            <span className={style.section}>Sender Re-Encryption Key</span>
            <textarea className={style.code} onChange={handleReEncryptionKey} value={reEncryptionKey} />
            <span className={style.section}>Transformable Secret</span>
            <textarea className={style.code} onChange={handleTransformableSecret} value={transformableSecret} />
            <span className={style.section}>Transformed Secret for Receiver</span>
            <textarea className={style.code} disabled value={transformedSecret} />
        </div>
    );
}

export default Proxy;
