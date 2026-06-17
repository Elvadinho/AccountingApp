import TopBar from './TopBar';

export default function PageWrapper({ title, children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title={title} />
      <main className="flex-1 px-6 py-6 overflow-y-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
}
