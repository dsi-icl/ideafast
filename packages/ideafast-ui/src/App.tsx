import React, { useState, useEffect } from 'react';
import { PRE, PREClient } from 'ideafast-pre';
import Party from './Party';
import style from './App.module.css';

const App: React.FC = () => {

    const [initialized, setInitialized] = useState(false);
    const [L0] = useState(32);
    const [L1] = useState(16);
    const [parties, setParties] = useState<Party[]>([]);

    const addParty = () => {
        const partyClient = new PREClient();
        partyClient.keyGen();
        setParties(parties.concat({
            id: parties.length + 1,
            partyClient
        }))
    }

    useEffect(() => {
        if (initialized === false)
            (async () => {
                try {
                    await PRE.init(L0, L1, PRE.CURVE.SECP256K1);
                    setParties([0, 1, 3].map((id) => {
                        const partyClient = new PREClient();
                        partyClient.keyGen();
                        return {
                            id,
                            partyClient
                        }
                    }))
                } catch (error) {
                    console.error('A problem occured', error);
                };
            })();

        setInitialized(true);
    }, [initialized, L0, L1]);

    return (
        <div className={style.dashboard} >
            <header className={style.header} >
                Proxy Re - Encryption POC <button onClick={() => addParty()}>Add party</button>
            </header>
            <section className={style.content}>
                {parties.map((party, index) => {
                    return <Party key={index} l0={L0} party={party} />
                })}
            </section>
        </div>
    );
}

export default App;
