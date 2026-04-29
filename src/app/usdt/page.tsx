import MainCalculator from '@/components/MainCalculator';

export default function UsdtPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <MainCalculator initialTab="usdt" />
    </div>
  );
}
