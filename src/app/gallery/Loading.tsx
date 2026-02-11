export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-8 pt-32">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-video rounded-xl bg-muted border border-border animate-pulse relative overflow-hidden">
            <div className="absolute bottom-4 left-4 h-4 w-1/2 bg-muted-foreground/20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}