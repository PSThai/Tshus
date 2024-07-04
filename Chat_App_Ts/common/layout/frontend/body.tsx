type Props = {
  children: React.ReactNode;
};
const Body: React.FC<Props> = ({ children }: Props) => {
  return <div style={{ width: '100%' }}>{children}</div>;
};

export default Body;
