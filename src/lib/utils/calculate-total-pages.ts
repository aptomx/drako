export default function getTotalPages(total: number, perPage: number) {
  return Math.ceil(total / perPage);
}
