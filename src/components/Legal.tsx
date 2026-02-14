'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Legal.module.css';

type Tab = 'impressum' | 'datenschutz';

function LegalContent() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState<Tab>('impressum');

    useEffect(() => {
        if (tabParam === 'datenschutz' || tabParam === 'impressum') {
            setActiveTab(tabParam);
            const el = document.getElementById('legal');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [tabParam]);

    return (
        <section id="legal" className={styles.legal}>
            <div className="container">
                <h2 className={styles.heading}>
                    Rechtliches &amp; <span className="accent-text">Datenschutz</span>
                </h2>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'impressum' ? styles.active : ''}`}
                        onClick={() => setActiveTab('impressum')}
                    >
                        Impressum
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'datenschutz' ? styles.active : ''}`}
                        onClick={() => setActiveTab('datenschutz')}
                    >
                        Datenschutz
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'impressum' && <ImpressumPanel />}
                    {activeTab === 'datenschutz' && <DatenschutzPanel />}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════
   IMPRESSUM — verbatim from LEGAL_CONTEXT.md
   ═══════════════════════════════════════════ */
function ImpressumPanel() {
    return (
        <div className={styles.panel}>
            <div className={styles.card}>
                <h3>Impressum</h3>
                <p>
                    Fahrschule-Sedat GmbH<br />
                    Krefelderstr 42<br />
                    47226 Duisburg
                </p>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h4>Handelsregister</h4>
                    <p>HRB 38945</p>
                    <p className={styles.sub}>Registergericht: Amtsgericht Duisburg</p>
                </div>
                <div className={styles.card}>
                    <h4>Geschäftsführer Inh.</h4>
                    <p>Sedat Kapcak</p>
                </div>
                <div className={styles.card}>
                    <h4>Verantwortliche Leiterin</h4>
                    <p>Emine Özkartal</p>
                </div>
            </div>

            <div className={styles.card}>
                <h4>Zuständige Verwaltungsbehörden</h4>
                <p>
                    Straßenverkehrsamt –
                    Stadt Duisburg – Straßenverkehrsamt – <a href="https://www.duisburg.de" target="_blank" rel="noopener noreferrer">www.duisburg.de</a>
                </p>
            </div>

            <div className={styles.card}>
                <h4>Kontakt</h4>
                <div className={styles.contactGrid}>
                    <div className={styles.contactItem}>
                        <span className={styles.contactIcon}>📞</span>
                        <div>
                            <p className={styles.contactLabel}>Telefon</p>
                            <a href="tel:+4920655507223">+49 (0) 2065 550 72 23</a>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <span className={styles.contactIcon}>📠</span>
                        <div>
                            <p className={styles.contactLabel}>Telefax</p>
                            <p>—</p>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <span className={styles.contactIcon}>✉️</span>
                        <div>
                            <p className={styles.contactLabel}>E-Mail</p>
                            <a href="mailto:info@fahrschule-sedat.de">info@fahrschule-sedat.de</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <h4>Umsatzsteuer-ID</h4>
                <p>
                    Umsatzsteuer-Identifikationsnummer gemäß §&nbsp;27&nbsp;a Umsatzsteuergesetz:<br />
                    DE454905869
                </p>
            </div>

            <div className={styles.card}>
                <h4>Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle</h4>
                <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
                <p className={styles.source}>Quelle: e-recht24.de</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   DATENSCHUTZERKLÄRUNG — verbatim from LEGAL_CONTEXT.md
   ═══════════════════════════════════════════════════ */
function DatenschutzPanel() {
    return (
        <div className={styles.panel}>
            {/* ─── 1. Datenschutz auf einen Blick ─── */}
            <div className={styles.card}>
                <h3>Datenschutzerklärung</h3>
            </div>

            <div className={styles.card}>
                <h3>1. Datenschutz auf einen Blick</h3>
                <h4>Allgemeine Hinweise</h4>
                <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber,
                    was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind
                    alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum
                    Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten
                    Datenschutzerklärung.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Datenerfassung auf dieser Website</h4>
                <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
                <p>
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
                    Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser
                    Datenschutzerklärung entnehmen.
                </p>

                <p style={{ marginTop: '1rem' }}><strong>Wie erfassen wir Ihre Daten?</strong></p>
                <p>
                    Ihre Daten werden zum
                    einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die Sie in ein
                    Kontaktformular eingeben.
                </p>
                <p>
                    Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch
                    der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.&nbsp;B. Internetbrowser,
                    Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese
                    Website betreten.
                </p>

                <p style={{ marginTop: '1rem' }}><strong>Wofür nutzen wir Ihre Daten?</strong></p>
                <p>
                    Ein Teil der Daten wird erhoben, um eine
                    fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres
                    Nutzerverhaltens verwendet werden. Sofern über die Website Verträge geschlossen oder angebahnt
                    werden können, werden die übermittelten Daten auch für Vertragsangebote, Bestellungen oder
                    sonstige Auftragsanfragen verarbeitet.
                </p>

                <p style={{ marginTop: '1rem' }}><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong></p>
                <p>
                    Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
                    gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder
                    Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
                    können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht,
                    unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
                    verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde
                    zu.
                </p>
                <p>
                    Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns
                    wenden.
                </p>
            </div>

            {/* ─── 2. Hosting ─── */}
            <div className={styles.card}>
                <h3>2. Hosting</h3>
                <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>

                <h4 style={{ marginTop: '1rem' }}>Strato</h4>
                <p>
                    Anbieter ist die Strato AG, Otto-Ostrowski-Straße 7, 10249 Berlin (nachfolgend
                    „Strato"). Wenn Sie unsere Website besuchen, erfasst Strato verschiedene Logfiles inklusive Ihrer IP-Adressen.
                </p>
                <p>
                    Weitere Informationen entnehmen Sie der Datenschutzerklärung von Strato:{' '}
                    <a href="https://www.strato.de/datenschutz/" target="_blank" rel="noopener noreferrer">https://www.strato.de/datenschutz/</a>.
                </p>
                <p>
                    Die Verwendung von Strato erfolgt auf Grundlage
                    von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen
                    Darstellung unserer Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung
                    ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die
                    Einwilligung die Speicherung von Cookies oder den Zugriff auf Informationen im Endgerät des Nutzers
                    (z.&nbsp;B. Device-Fingerprinting) im Sinne des TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.
                </p>
            </div>

            {/* ─── 3. Allgemeine Hinweise und Pflichtinformationen ─── */}
            <div className={styles.card}>
                <h3>3. Allgemeine Hinweise und Pflicht&shy;informationen</h3>

                <h4>Datenschutz</h4>
                <p>
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
                    ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
                    Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
                <p>
                    Wenn Sie diese Website benutzen,
                    werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie
                    persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert,
                    welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das
                    geschieht.
                </p>
                <p>
                    Wir weisen darauf hin, dass die Datenübertragung im Internet (z.&nbsp;B. bei der
                    Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor
                    dem Zugriff durch Dritte ist nicht möglich.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Hinweis zur verantwortlichen Stelle</h4>
                <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                <p>
                    Fahrschule-Sedat GmbH<br />
                    Krefelderstr. 42<br />
                    47226 Duisburg
                </p>
                <p>
                    Telefon: +49 2065/5507223<br />
                    E-Mail: <a href="mailto:Info@fahrschule-sedat.de">Info@fahrschule-sedat.de</a>
                </p>
                <p>
                    Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen
                    über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z.&nbsp;B. Namen, E-Mail-Adressen o.&nbsp;Ä.) entscheidet.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Speicherdauer</h4>
                <p>
                    Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer
                    genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung
                    entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur
                    Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich
                    zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z.&nbsp;B. steuer-
                    oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall
                    dieser Gründe.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website</h4>
                <p>
                    Sofern Sie
                    in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art.
                    6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO
                    verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung in die Übertragung personenbezogener
                    Daten in Drittstaaten erfolgt die Datenverarbeitung außerdem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO.
                    Sofern Sie in die Speicherung von Cookies oder in den Zugriff auf Informationen in Ihr Endgerät (z.&nbsp;B. via
                    Device-Fingerprinting) eingewilligt haben, erfolgt die Datenverarbeitung zusätzlich auf Grundlage von §
                    25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur Vertragserfüllung oder zur
                    Durchführung vorvertraglicher Maßnahmen erforderlich, verarbeiten wir Ihre Daten auf Grundlage des
                    Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer
                    rechtlichen Verpflichtung erforderlich sind auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung
                    kann ferner auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. Über die
                    jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird in den folgenden Absätzen dieser
                    Datenschutzerklärung informiert.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Empfänger von personenbezogenen Daten</h4>
                <p>
                    Im Rahmen unserer Geschäftstätigkeit
                    arbeiten wir mit verschiedenen externen Stellen zusammen. Dabei ist teilweise auch eine Übermittlung von
                    personenbezogenen Daten an diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur dann an
                    externe Stellen weiter, wenn dies im Rahmen einer Vertragserfüllung erforderlich ist, wenn wir gesetzlich
                    hierzu verpflichtet sind (z.&nbsp;B. Weitergabe von Daten an Steuerbehörden), wenn wir ein berechtigtes
                    Interesse nach Art. 6 Abs. 1 lit. f DSGVO an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die
                    Datenweitergabe erlaubt. Beim Einsatz von Auftragsverarbeitern geben wir personenbezogene Daten unserer
                    Kunden nur auf Grundlage eines gültigen Vertrags über Auftragsverarbeitung weiter. Im Falle einer
                    gemeinsamen Verarbeitung wird ein Vertrag über gemeinsame Verarbeitung geschlossen.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h4>
                <p>
                    Viele Datenverarbeitungsvorgänge sind
                    nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung
                    jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom
                    Widerruf unberührt.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)</h4>
                <div className={styles.infoBox}>
                    <p style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.8 }}>
                        WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F
                        DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER
                        BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN
                        WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES
                        PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN
                        SIE DIESER DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE
                        BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR
                        KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG
                        NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN ODER DIE
                        VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON
                        RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).
                    </p>
                    <p style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.8, marginTop: '1rem' }}>
                        WERDEN IHRE
                        PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS
                        RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER
                        DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR DAS PROFILING,
                        SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN,
                        WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER
                        DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
                    </p>
                </div>

                <h4 style={{ marginTop: '1.5rem' }}>Beschwerde&shy;recht bei der zuständigen Aufsichts&shy;behörde</h4>
                <p>
                    Im Falle von
                    Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer
                    Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres
                    Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht
                    unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Recht auf Daten&shy;übertrag&shy;barkeit</h4>
                <p>
                    Sie haben das Recht, Daten, die wir auf Grundlage
                    Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in
                    einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte
                    Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch
                    machbar ist.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Auskunft, Berichtigung und Löschung</h4>
                <p>
                    Sie haben im Rahmen der geltenden gesetzlichen
                    Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen
                    Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf
                    Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene
                    Daten können Sie sich jederzeit an uns wenden.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Recht auf Einschränkung der Verarbeitung</h4>
                <p>
                    Sie haben das Recht, die Einschränkung der
                    Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu können Sie sich jederzeit an uns wenden.
                    Das Recht auf Einschränkung der Verarbeitung besteht in folgenden Fällen:
                </p>
                <div className={styles.listGroup}>
                    <div className={styles.listItem}>
                        <span className={styles.bullet}>●</span>
                        <div>Wenn Sie die
                            Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, benötigen wir in der Regel Zeit,
                            um dies zu überprüfen. Für die Dauer der Prüfung haben Sie das Recht, die
                            Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</div>
                    </div>
                    <div className={styles.listItem}>
                        <span className={styles.bullet}>●</span>
                        <div>Wenn die
                            Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie statt
                            der Löschung die Einschränkung der Datenverarbeitung verlangen.</div>
                    </div>
                    <div className={styles.listItem}>
                        <span className={styles.bullet}>●</span>
                        <div>Wenn wir Ihre
                            personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, Verteidigung oder
                            Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt der Löschung die
                            Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</div>
                    </div>
                    <div className={styles.listItem}>
                        <span className={styles.bullet}>●</span>
                        <div>Wenn Sie einen
                            Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung zwischen Ihren und unseren
                            Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen überwiegen, haben Sie das
                            Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</div>
                    </div>
                </div>
                <p style={{ marginTop: '1rem' }}>
                    Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen diese
                    Daten – von ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung,
                    Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen
                    natürlichen oder juristischen Person oder aus Gründen eines wichtigen öffentlichen Interesses der
                    Europäischen Union oder eines Mitgliedstaats verarbeitet werden.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>SSL- bzw. TLS-Verschlüsselung</h4>
                <p>
                    Diese Seite nutzt aus Sicherheitsgründen und zum Schutz
                    der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als
                    Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen
                    Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und
                    an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
                <p>
                    Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist,
                    können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Widerspruch gegen Werbe-E-Mails</h4>
                <p>
                    Der Nutzung von im Rahmen der Impressumspflicht
                    veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung
                    und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich
                    rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails,
                    vor.
                </p>
            </div>

            {/* ─── 4. Datenerfassung auf dieser Website ─── */}
            <div className={styles.card}>
                <h3>4. Datenerfassung auf dieser Website</h3>

                <h4>Cookies</h4>
                <p>
                    Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine
                    Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend
                    für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät
                    gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies
                    bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische
                    Löschung durch Ihren Webbrowser erfolgt.
                </p>
                <p>
                    Cookies können von uns (First-Party-Cookies) oder
                    von Drittunternehmen stammen (sog. Third-Party-Cookies). Third-Party-Cookies ermöglichen die Einbindung
                    bestimmter Dienstleistungen von Drittunternehmen innerhalb von Webseiten (z.&nbsp;B. Cookies zur Abwicklung
                    von Zahlungsdienstleistungen).
                </p>
                <p>
                    Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch
                    notwendig, da bestimmte Webseitenfunktionen ohne diese nicht funktionieren würden (z.&nbsp;B. die
                    Warenkorbfunktion oder die Anzeige von Videos). Andere Cookies können zur Auswertung des
                    Nutzerverhaltens oder zu Werbezwecken verwendet werden.
                </p>
                <p>
                    Cookies, die zur Durchführung des
                    elektronischen Kommunikationsvorgangs, zur Bereitstellung bestimmter, von Ihnen erwünschter Funktionen
                    (z.&nbsp;B. für die Warenkorbfunktion) oder zur Optimierung der Website (z.&nbsp;B. Cookies zur Messung
                    des Webpublikums) erforderlich sind (notwendige Cookies), werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
                    gespeichert, sofern keine andere Rechtsgrundlage angegeben wird. Der Websitebetreiber hat ein berechtigtes
                    Interesse an der Speicherung von notwendigen Cookies zur technisch fehlerfreien und optimierten Bereitstellung
                    seiner Dienste. Sofern eine Einwilligung zur Speicherung von Cookies und vergleichbaren
                    Wiedererkennungstechnologien abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage dieser
                    Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG); die Einwilligung ist jederzeit widerrufbar.
                </p>
                <p>
                    Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und
                    Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell
                    ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
                    Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
                </p>
                <p>
                    Welche Cookies und Dienste auf dieser Website eingesetzt werden, können Sie dieser
                    Datenschutzerklärung entnehmen.
                </p>

                <h4 style={{ marginTop: '1.5rem' }}>Kontaktformular</h4>
                <p>
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre
                    Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung
                    der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre
                    Einwilligung weiter.
                </p>
                <p>
                    Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO,
                    sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung
                    vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf
                    unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
                    DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist
                    jederzeit widerrufbar.
                </p>
                <p>
                    Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie
                    uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die
                    Datenspeicherung entfällt (z.&nbsp;B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende
                    gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.
                </p>
            </div>

            {/* ─── 5. Soziale Medien ─── */}
            <div className={styles.card}>
                <h3>5. Soziale Medien</h3>

                <h4>Instagram</h4>
                <p>
                    Auf dieser Website sind Funktionen des Dienstes Instagram eingebunden. Diese
                    Funktionen werden angeboten durch die Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5,
                    Irland.
                </p>
                <p>
                    Wenn das Social-Media-Element aktiv ist, wird eine direkte Verbindung zwischen Ihrem
                    Endgerät und dem Instagram-Server hergestellt. Instagram erhält dadurch Informationen über
                    den Besuch dieser Website durch Sie.
                </p>
                <p>
                    Wenn Sie in Ihrem Instagram-Account eingeloggt sind, können
                    Sie durch Anklicken des Instagram-Buttons die Inhalte dieser Website mit Ihrem Instagram-Profil verlinken.
                    Dadurch kann Instagram den Besuch dieser Website Ihrem Benutzerkonto zuordnen. Wir weisen darauf hin, dass
                    wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch
                    Instagram erhalten.
                </p>
                <p>
                    Die Nutzung dieses Dienstes erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1
                    lit. a DSGVO und § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar.
                </p>
                <p>
                    Soweit mit Hilfe des
                    hier beschriebenen Tools personenbezogene Daten auf unserer Website erfasst und an Facebook bzw. Instagram
                    weitergeleitet werden, sind wir und die Meta Platforms Ireland Limited, 4 Grand Canal Square, Grand Canal
                    Harbour, Dublin 2, Irland gemeinsam für diese Datenverarbeitung verantwortlich (Art. 26 DSGVO). Die
                    gemeinsame Verantwortlichkeit beschränkt sich dabei ausschließlich auf die Erfassung der Daten und
                    deren Weitergabe an Facebook bzw. Instagram. Die nach der Weiterleitung erfolgende Verarbeitung durch
                    Facebook bzw. Instagram ist nicht Teil der gemeinsamen Verantwortung. Die uns gemeinsam obliegenden
                    Verpflichtungen wurden in einer Vereinbarung über gemeinsame Verarbeitung festgehalten. Den Wortlaut
                    der Vereinbarung finden Sie unter:{' '}
                    <a href="https://www.facebook.com/legal/controller_addendum" target="_blank" rel="noopener noreferrer">https://www.facebook.com/legal/controller_addendum</a>. Laut
                    dieser Vereinbarung sind wir für die Erteilung der Datenschutzinformationen beim Einsatz des Facebook-
                    bzw. Instagram-Tools und für die datenschutzrechtlich sichere Implementierung des Tools auf unserer
                    Website verantwortlich. Für die Datensicherheit der Facebook bzw. Instagram-Produkte ist Facebook
                    verantwortlich. Betroffenenrechte (z.&nbsp;B. Auskunftsersuchen) hinsichtlich der bei Facebook bzw. Instagram
                    verarbeiteten Daten können Sie direkt bei Facebook geltend machen. Wenn Sie die Betroffenenrechte bei uns
                    geltend machen, sind wir verpflichtet, diese an Facebook weiterzuleiten.
                </p>
                <p>
                    Die Datenübertragung in die
                    USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt. Details finden Sie hier:{' '}
                    <a href="https://www.facebook.com/legal/EU_data_transfer_addendum" target="_blank" rel="noopener noreferrer">https://www.facebook.com/legal/EU_data_transfer_addendum</a>,{' '}
                    <a href="https://privacycenter.instagram.com/policy/" target="_blank" rel="noopener noreferrer">https://privacycenter.instagram.com/policy/</a> und{' '}
                    <a href="https://de-de.facebook.com/help/566994660333381" target="_blank" rel="noopener noreferrer">https://de-de.facebook.com/help/566994660333381</a>.
                </p>
                <p>
                    Weitere Informationen hierzu finden Sie in der
                    Datenschutzerklärung von Instagram:{' '}
                    <a href="https://privacycenter.instagram.com/policy/" target="_blank" rel="noopener noreferrer">https://privacycenter.instagram.com/policy/</a>.
                </p>
                <p>
                    Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy
                    Framework" (DPF). Der DPF ist ein Übereinkommen zwischen der Europäischen Union und den
                    USA, der die Einhaltung europäischer Datenschutzstandards bei Datenverarbeitungen in den USA
                    gewährleisten soll. Jedes nach dem DPF zertifizierte Unternehmen verpflichtet sich, diese
                    Datenschutzstandards einzuhalten. Weitere Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link:{' '}
                    <a href="https://www.dataprivacyframework.gov/participant/4452" target="_blank" rel="noopener noreferrer">https://www.dataprivacyframework.gov/participant/4452</a>.
                </p>

                <p className={styles.source}>Quelle: https://www.e-recht24.de</p>
            </div>
        </div>
    );
}

export default function Legal() {
    return (
        <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>Laden…</div>}>
            <LegalContent />
        </Suspense>
    );
}
