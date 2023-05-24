import styled from 'styled-components';

export const QRCameraWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem 1rem;

  .title {
    color: var(--network-color-primary);
    font-family: 'Unbounded';
    margin-bottom: 1rem;
  }

  .viewer {
    border: 2.5px solid var(--network-color-primary);
    border-radius: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 250px;
    height: 187.5px;
    overflow: hidden;

    .ph {
      color: var(--network-color-pending);
      position: absolute;
      top: 35%;
      left: 35%;
      width: 30%;
      height: 30%;
      opacity: 0.5;
    }

    .reader {
      position: relative;
      margin: 1.5rem 0;
      width: 250px;
    }
  }
  .foot {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.75rem;

    .address {
      display: flex;
      margin-top: 0.5rem;
      margin-bottom: 1.25rem;

      svg {
        margin-right: 0.6rem;
      }
    }
    > div {
      display: flex;
    }
  }
`;
