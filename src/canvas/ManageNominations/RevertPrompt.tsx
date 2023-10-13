import { ButtonPrimary } from '@polkadot-cloud/react';
import { Title } from 'library/Prompt/Title';

export const RevertPrompt = ({ onRevert }: { onRevert: () => void }) => (
  <>
    <Title title="Revert Nominations" closeText="Cancel" />
    <div className="body">
      <h4 className="definition">
        Are you sure you wish to revert the changes to your selected
        nominations?
      </h4>

      <div
        style={{
          marginTop: '0.75rem',
          marginBottom: '0.5rem',
          display: 'flex',
        }}
      >
        <ButtonPrimary
          marginRight
          text="Revert Changes"
          onClick={() => onRevert()}
        />
      </div>
    </div>
  </>
);
