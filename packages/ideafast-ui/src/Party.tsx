import React, { useState, useEffect } from 'react';
import { PREProxy } from 'ideafast-pre';
import style from './Party.module.css';

type PartyProps = {
    party: Party;
    l0: number;
}

const Party: React.FC<PartyProps> = ({ party, l0 }) => {

    const { id, partyClient } = party;
    const [ownPk] = useState(partyClient.getPk());
    const [ownSk] = useState(partyClient.getSk());
    const [ownMessage, setOwnMessage] = useState('');
    const [receipientPk, setReceipientPk] = useState('');
    const [reEncryptionKey, setReEncryptionKey] = useState('');
    const [transformableMessage, setTransformableMessage] = useState('');
    const [nonTransformableMessage, setNonTransformableMessage] = useState('');
    const [receivedSecret, setReceivedSecret] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');

    useEffect(() => {
        try {
            const message = partyClient.dec(Buffer.from(receivedSecret, 'base64'))[1];
            setReceivedMessage(message?.toString('ascii') ?? '');
        } catch (e) {
            if (receivedSecret !== '')
                setReceivedMessage(`Not decodable: ${e?.message}`);
        }
    }, [receivedSecret, partyClient])

    useEffect(() => {
        try {
            const messageBuffer = new Buffer(ownMessage);
            const transportBuffer = new Uint8Array(l0)
            messageBuffer.copy(transportBuffer);
            const transformable = partyClient.enc(transportBuffer, { transformable: true });
            const nonTransformable = partyClient.enc(transportBuffer, { transformable: false });
            if (receipientPk === '') {
                setReEncryptionKey('');
                setTransformableMessage(transformable?.toString('base64') ?? '');
                setNonTransformableMessage(nonTransformable?.toString('base64') ?? '');
            } else {
                const reKey = partyClient.reKeyGen(Buffer.from(receipientPk, 'base64'));
                setReEncryptionKey(reKey.toString('base64'));
                setTransformableMessage(PREProxy.reEnc(transformable, reKey, ownPk)[1]?.toString('base64') ?? '');
                setNonTransformableMessage(PREProxy.reEnc(nonTransformable, reKey, ownPk)[1]?.toString('base64') ?? '');
            }
        } catch (e) {
            setReEncryptionKey('');
            setTransformableMessage(`Could not compute transformable: ${e?.message}`);
            setNonTransformableMessage(`Could not compute non-transformable: ${e?.message}`);
        }
    }, [receipientPk, ownMessage, l0, partyClient, ownPk])

    const handleOwnMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const message = event.target.value;
        setOwnMessage(message);
    }

    const handleReceipientPk = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const pk = event.target.value;
        setReceipientPk(pk);
    }

    const handleReEncryptionKey = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const rek = event.target.value;
        setReEncryptionKey(rek);
    }

    const handleReceivedSecret = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const secret = event.target.value;
        setReceivedSecret(secret);
    }

    return (
        <div className={style.wrapper} >
            <span className={style.title}>Party #{id}</span><br />
            <span className={style.section}>Own Private Key</span>
            <textarea className={style.code} disabled defaultValue={ownSk.toString('base64')} />
            <span className={style.section}>Own Public Key</span>
            <textarea className={style.code} disabled defaultValue={ownPk.toString('base64')} />
            <span className={style.section}>Own Message</span>
            <textarea className={style.code} onChange={handleOwnMessage} value={ownMessage} maxLength={32} />
            <span className={style.section}>Counterparty Public Key</span>
            <textarea className={style.code} onChange={handleReceipientPk} value={receipientPk} />
            <span className={style.section}>ReEncryption Key</span>
            <textarea className={style.code} disabled onChange={handleReEncryptionKey} value={reEncryptionKey} />
            <span className={style.section}>Transformable Secret</span>
            <textarea className={style.code} disabled value={transformableMessage} />
            <span className={style.section}>Non-transformable Secret</span>
            <textarea className={style.code} disabled value={nonTransformableMessage} />
            <span className={style.section}>Received Secret</span>
            <textarea className={style.code} onChange={handleReceivedSecret} value={receivedSecret} />
            <span className={style.section}>Received Message</span>
            <textarea className={style.code} disabled value={receivedMessage} />
        </div>
    );
}

export default Party;
