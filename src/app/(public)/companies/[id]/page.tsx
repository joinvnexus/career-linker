export default function CompanyPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Company {params.id}</h1>
      <p>Company profile details.</p>
    </div>
  );
}
