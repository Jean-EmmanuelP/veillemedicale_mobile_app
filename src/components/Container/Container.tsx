import './Container.css';

interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return <view class="container">{children}</view>;
}