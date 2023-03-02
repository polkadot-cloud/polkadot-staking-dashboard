import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { ContentWrapper, PaddingWrapper } from 'modals/Wrappers';
import React from 'react';
import { AnyJson } from 'types';
import { RowButton, TableRowsWrapper } from './Wrapper';

// A modal wrapper to show a table
interface TableModalProps {
  // title of the modal
  title: string;
  // table data
  data: Array<AnyJson>;
  // a function to render each row
  render: (row: AnyJson) => React.ReactNode;
}
export const TableModal = () => {
  const { config } = useModal();
  const { title, data, render } = config as TableModalProps;

  return (
    <>
      <Title title={title} />
      <PaddingWrapper>
        <ContentWrapper>
          <TableRowsWrapper>
            {data.map((row, index) => (
              <RowButton key={index}>{render(row)}</RowButton>
            ))}
          </TableRowsWrapper>
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};
