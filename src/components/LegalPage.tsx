import { Container, Footer, Header } from "@/components/site";

type LegalSection = {
  title: string;
  body: string;
};

export default function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface-low py-16 sm:py-20">
          <Container className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-accent">Company policy</p>
            <h1 className="mt-4 text-4xl font-bold text-primary sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{intro}</p>
          </Container>
        </section>
        <section className="bg-white py-16 sm:py-20">
          <Container className="max-w-4xl space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold text-primary">{section.title}</h2>
                <p className="mt-4 leading-7 text-muted">{section.body}</p>
              </section>
            ))}
            <p className="border-t border-border pt-8 text-sm text-muted">
              Questions about this policy can be sent to sales@xingtaioubei.com.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
