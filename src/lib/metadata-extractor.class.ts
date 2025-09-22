import { CentralDirectory, File, Open } from 'unzipper';
import { xml2js } from 'xml-js';

import type { JSONObject, PublicPropertiesOf } from '../types';
import { getErrorMessage, getValueAtPath } from '../utils';

export type Metadata = PublicPropertiesOf<MetadataExtractor>;

export class MetadataExtractor {
  private readonly _fileBuffer: Buffer;

  private _coreProperties: JSONObject;

  private _appProperties: JSONObject;

  public constructor(fileBuffer: Buffer) {
    this._fileBuffer = fileBuffer;
  }

  public async extract(): Promise<void> {
    try {
      const content: CentralDirectory = await Open.buffer(this._fileBuffer);

      const files: File[] = content.files.filter(
        (file: File) =>
          file.path.endsWith('core.xml') || file.path.endsWith('app.xml'),
      );

      if (!files.length) {
        throw new Error('Metadata files not found');
      }

      for (const curFile of files) {
        const curFileBuffer: Buffer = await curFile.buffer();

        if (curFile.path.endsWith('core.xml')) {
          this._coreProperties = xml2js(curFileBuffer.toString('utf8'), {
            compact: true,
          }) as JSONObject;
        } else if (curFile.path.endsWith('app.xml')) {
          this._appProperties = xml2js(curFileBuffer.toString('utf8'), {
            compact: true,
          }) as JSONObject;
        }
      }
    } catch (error: unknown) {
      throw new Error(
        `Error while extracting file metadata. Message: ${getErrorMessage(error)}`,
        {
          cause: error,
        },
      );
    }
  }

  public get title(): string | undefined {
    return getValueAtPath(
      this._coreProperties,
      'cp:coreProperties.dc:title._text',
    );
  }

  public get subject(): string | undefined {
    return getValueAtPath(
      this._coreProperties,
      'cp:coreProperties.dc:subject._text',
    );
  }

  public get description(): string | undefined {
    return getValueAtPath(
      this._coreProperties,
      'cp:coreProperties.dc:description._text',
    );
  }

  public get createdBy(): string | undefined {
    return getValueAtPath(
      this._coreProperties,
      'cp:coreProperties.dc:creator._text',
    );
  }

  public get createdAt(): Date | undefined {
    return getValueAtPath(
      this._coreProperties,
      'cp:coreProperties.dcterms:created._text',
      (value: unknown) => new Date(value as string),
    );
  }

  public get lastModifiedBy(): string | undefined {
    return getValueAtPath(
      this._coreProperties,
      'cp:coreProperties.cp:lastModifiedBy._text',
    );
  }

  public get lastModifiedAt(): Date | undefined {
    return getValueAtPath(
      this._coreProperties,
      'cp:coreProperties.dcterms:modified._text',
      (value: unknown) => new Date(value as string),
    );
  }

  public get revision(): number | undefined {
    return getValueAtPath(
      this._coreProperties,
      'cp:coreProperties.cp:revision._text',
      Number,
    );
  }

  public get pagesCount(): number | undefined {
    return getValueAtPath(
      this._appProperties,
      'Properties.Pages._text',
      Number,
    );
  }

  public get wordsCount(): number | undefined {
    return getValueAtPath(
      this._appProperties,
      'Properties.Words._text',
      Number,
    );
  }

  public getMetadata(): Metadata {
    return {
      title: this.title,
      subject: this.subject,
      description: this.description,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      lastModifiedBy: this.lastModifiedBy,
      lastModifiedAt: this.lastModifiedAt,
      revision: this.revision,
      pagesCount: this.pagesCount,
      wordsCount: this.wordsCount,
    };
  }
}
