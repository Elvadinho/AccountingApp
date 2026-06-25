import TopBar from './TopBar';

export default function PageWrapper({ title, children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title={title} />
      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full animate-fade-in print:max-w-none print:px-2 print:py-2">
        {children}
      </main>
    </div>
  );
}
