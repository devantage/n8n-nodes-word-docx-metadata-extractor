import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { MetadataExtractor } from '../lib';
import { getErrorMessage } from '../utils';

export class WordDocxMetadataExtractor implements INodeType {
  public description: INodeTypeDescription = {
    displayName: 'Word DOCX Metadata Extractor',
    name: 'wordDocxMetadataExtractor',
    icon: 'file:../icons/icon.svg',
    group: ['transform'],
    version: 1,
    description: 'n8n community nodes for Word DOCX metadata extraction',
    defaults: {
      name: 'Word DOCX Metadata Extractor',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    properties: [
      {
        name: 'binaryPropertyName',
        displayName: 'Binary File Property Name',
        type: 'string',
        required: true,
        default: 'data',
      },
    ],
  };

  public async execute(
    this: IExecuteFunctions,
  ): Promise<INodeExecutionData[][] | null> {
    const returnData: INodeExecutionData[] = [];
    const items: INodeExecutionData[] = this.getInputData();

    for (let itemIndex: number = 0; itemIndex < items.length; itemIndex++) {
      try {
        const binaryPropertyName: string = this.getNodeParameter(
          'binaryPropertyName',
          itemIndex,
        );

        this.helpers.assertBinaryData(itemIndex, binaryPropertyName);

        const binaryDataBuffer: Buffer = await this.helpers.getBinaryDataBuffer(
          itemIndex,
          binaryPropertyName,
        );

        const metadataExtractor: MetadataExtractor = new MetadataExtractor(
          binaryDataBuffer,
        );

        await metadataExtractor.extract();

        returnData.push({
          json: metadataExtractor.getMetadata(),
        });
      } catch (error: unknown) {
        const nodeOperationError: NodeOperationError =
          error instanceof NodeOperationError
            ? error
            : new NodeOperationError(this.getNode(), getErrorMessage(error), {
                itemIndex,
              });

        if (this.continueOnFail()) {
          returnData.push({
            json: {},
            error: nodeOperationError,
            pairedItem: itemIndex,
          });
        } else {
          throw nodeOperationError;
        }
      }
    }

    return [returnData];
  }
}
