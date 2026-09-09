/** Vangt onverwachte fouten op, zodat de hele hub niet op een wit scherm eindigt.
 *  Toont wat er misging en biedt aan de opgeslagen gegevens te downloaden of te
 *  wissen — zodat je nooit vastzit. */

import { Component } from 'react';
import { OPSLAG_SLEUTEL } from '../../data/constanten.js';

export class Foutgrens extends Component {
  constructor(props) {
    super(props);
    this.state = { fout: null };
  }

  static getDerivedStateFromError(fout) {
    return { fout };
  }

  componentDidCatch(fout, info) {
    /* Zichtbaar in de console, zodat je het kunt opzoeken. */
    console.error('Fout in de projecthub:', fout, info);
  }

  downloadGegevens = () => {
    try {
      const inhoud = window.localStorage.getItem(OPSLAG_SLEUTEL) || '{}';
      const blob = new Blob([inhoud], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'planeterrella-hub-noodback-up.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.alert('De gegevens konden niet gedownload worden.');
    }
  };

  wisEnHerlaad = () => {
    const zeker = window.confirm(
      'Alle opgeslagen gegevens in deze browser worden gewist en de hub start opnieuw met de startgegevens. Doorgaan?',
    );
    if (!zeker) return;
    try {
      window.localStorage.removeItem(OPSLAG_SLEUTEL);
    } catch {
      /* niets aan te doen */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.fout) return this.props.children;

    return (
      <div style={{ padding: 32, maxWidth: 640, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Er ging iets mis</h1>
        <p style={{ color: '#555', lineHeight: 1.55 }}>
          De projecthub liep vast op een onverwachte fout. Je gegevens staan nog gewoon in de browser. Download ze voor
          de zekerheid, en probeer daarna de pagina te vernieuwen.
        </p>
        <pre
          style={{
            background: '#f4f5f7',
            border: '1px solid #d8dce2',
            borderRadius: 8,
            padding: 12,
            fontSize: 12,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {String(this.state.fout?.message || this.state.fout)}
        </pre>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          <button type="button" onClick={() => window.location.reload()} style={knopStijl(true)}>
            Pagina vernieuwen
          </button>
          <button type="button" onClick={this.downloadGegevens} style={knopStijl(false)}>
            Gegevens downloaden
          </button>
          <button type="button" onClick={this.wisEnHerlaad} style={knopStijl(false)}>
            Opslag wissen en opnieuw beginnen
          </button>
        </div>
      </div>
    );
  }
}

function knopStijl(primair) {
  return {
    padding: '8px 14px',
    borderRadius: 7,
    border: `1px solid ${primair ? '#3b5bdb' : '#bcc3cc'}`,
    background: primair ? '#3b5bdb' : '#fff',
    color: primair ? '#fff' : '#16202c',
    fontSize: 14,
    fontWeight: 550,
    cursor: 'pointer',
  };
}

export default Foutgrens;
