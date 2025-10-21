import React from 'react';
import { gitCommitPath } from 'lib/paths';
import { useLatestVersion } from 'lib/hooks/api/latestVersion';
import { formatTimestamp } from 'lib/dateTimeHelpers';
import { useTimezone } from 'lib/hooks/useTimezones';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

import * as S from './Version.styled';

const TagIcon: React.FC = () => (
  <FontAwesomeIcon icon={faTag} style={{ fontSize: '12px' }} />
);

const Version: React.FC = () => {
  const { currentTimezone } = useTimezone();
  const { data: latestVersionInfo = {} } = useLatestVersion();
  const { buildTime, commitId, isLatestRelease, version } =
    latestVersionInfo.build;
  const { versionTag } = latestVersionInfo?.latestRelease || '';

  const currentVersion =
    isLatestRelease && version?.match(versionTag)
      ? versionTag
      : formatTimestamp({
          timestamp: buildTime,
          timezone: currentTimezone.value,
        });

  return (
    <S.Wrapper>
      {isLatestRelease === false && (
        <S.OutdatedWarning
          title={`New version available: ${versionTag || 'UNKNOWN'}`}
        >
          <TagIcon />
        </S.OutdatedWarning>
      )}

      {commitId && (
        <div>
          <S.CurrentCommitLink
            title="Current commit"
            target="__blank"
            href={gitCommitPath(commitId)}
          >
            {commitId}
          </S.CurrentCommitLink>
        </div>
      )}
      <S.CurrentVersion>{currentVersion}</S.CurrentVersion>
    </S.Wrapper>
  );
};

export default Version;
