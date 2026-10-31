import { type ILoadOptionsFunctions, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type ISupplyDataFunctions, type SupplyData } from 'n8n-workflow';
export declare class LmChatMetaMuse implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData>;
}
