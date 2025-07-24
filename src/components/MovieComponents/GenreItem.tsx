interface Props {
  genre: string;
}

export const GenreItem = ({ genre }: Props) => {
  return (
    <div className="bg-white/15 rounded-4xl text-center py-2 px-4 font-semibold">
      {genre}
    </div>
  );
};
