interface Props {
  genre: string;
}

export const GenreItem = ({ genre }: Props) => {
  return <div className="bg-white/30 rounded-4xl text-center p-3">{genre}</div>;
};
