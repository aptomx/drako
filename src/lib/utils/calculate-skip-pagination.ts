export default function getSkip(page: number, perPage: number) {
  return (page - 1) * perPage;
}
