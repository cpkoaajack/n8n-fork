import { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from "n8n-workflow";
import { TransactionalEmail } from "./Model";

export const emailOperations: Array<INodeProperties> = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'email',
				],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
			},
		],
		routing: {
			request: {
				method: 'POST',
				url: '/v3/smtp/email'
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions> {
						const presendData = requestOptions.body?.valueOf() as TransactionalEmail;

						// Handle optional data fields, that if sent as empty break the request
						for(let [key, value] of Object.entries(presendData)) {
							if(value == "") {
								delete presendData[key as keyof TransactionalEmail];
							}
						}

						return requestOptions;
					}
				]
			},
			output: {
				postReceive: [
					{
						type: 'set',
						properties: {
							value: '={{ { "success": $response.body } }}', // Also possible to use the original response data
						},
					},
				]
			}
		},
		default: 'send',
	}
];

export const emailFields: Array<INodeProperties> = [
	{
		displayName: 'Sender',
		name: 'sender',
		placeholder: 'Add Sender',
		required: true,
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: [
					'email',
				],
				operation: [
					'send',
				],
			},
		},
		default: {},
		options: [
			{
				name: 'sender',
				displayName: 'Sender',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '=sender.name',
								type: 'body',
							},
						},
						description: 'Name of the sender',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '=sender.email',
								type: 'body',
							},
						},
						description: 'Email of the sender',
					},
				],
				required: true
			},
		],
	},
	{
		displayName: 'Receipients',
		name: 'receipients',
		placeholder: 'Add Receipient',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: [
					'email',
				],
				operation: [
					'send',
				],
			},
		},
		default: {},
		options: [
			{
				name: 'receipient',
				displayName: 'Receipient',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '=to[{{$index}}].name',
								type: 'body',
							},
						},
						description: 'Name of the receipient',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '=to[{{$index}}].email',
								type: 'body',
							},
						},
						description: 'Email of the receipient',
					},
				],
			},
		],
		required: true
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'email',
				],
				operation: [
					'send',
				],
			},
		},
		routing: {
			send: {
				property: 'subject',
				type: 'body',
			},
		},
		default: '',
		description: 'Subject of the email',
	},
	{
		displayName: 'Text Content',
		name: 'textContent',
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'email',
				],
				operation: [
					'send',
				],
			},
		},
		routing: {
			send: {
				property: 'textContent',
				type: 'body',
			},
		},
		default: '',
		description: 'Text content of the message',
	},
	{
		displayName: 'HTML Content',
		name: 'htmlContent',
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'email',
				],
				operation: [
					'send',
				],
			},
		},
		routing: {
			send: {
				property: 'htmlContent',
				type: 'body',
			},
		},
		default: '',
		description: 'HTML content of the message',
	},
	{
		displayName: 'Additional Parameters',
		name: 'additionalParameters',
		placeholder: 'Add Parameter',
		description: 'Additional fields to add',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'email',
				],
				operation: [
					'send',
				],
			},
		},
		options: [
			// {
			// 	displayName: 'HTML Content',
			// 	name: 'htmlContent',
			// 	type: 'collection',
			// 	placeholder: 'HTML template',
			// 	typeOptions: {
			// 		multipleValues: true,
			// 	},
			// 	default: {},
			// 	options: [
			// 		{
			// 			name: 'htmlTemplate',
			// 			displayName: 'HTML Template',
			// 			type: 'string',
			// 			default: '',
			// 		},
			// 		{
			// 			displayName: 'Template Parameters',
			// 			name: 'params',
			// 			type: 'collection',
			// 			default: {},
			// 			options: [
			// 				{
			// 					name: 'attributesValues',
			// 					displayName: 'Attribute',
			// 					values: [
			// 						{
			// 							displayName: 'Param Name',
			// 							name: 'paramName',
			// 							type: 'string',
			// 							default: '',
			// 						},
			// 						{
			// 							displayName: 'Param Value',
			// 							name: 'paramValue',
			// 							type: 'string',
			// 							default: '',
			// 						},
			// 					],
			// 				},
			// 			],
			// 			routing: {
			// 				send: {
			// 					property: 'parameters',
			// 					type: 'body',
			// 				},
			// 			},
			// 			description: 'Parameters to hydrate HTML Tempalate',
			// 		}
			// 	],
			// },
			{
				displayName: 'Receipients BCC',
				name: 'receipientsBCC',
				placeholder: 'Add BCC',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'receipientBcc',
						displayName: 'Receipient',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								routing: {
									send: {
										property: '=bcc[{{$index}}].name',
										type: 'body',
									},
								},
								description: 'Name of the BCC receipient',
							},
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
								routing: {
									send: {
										property: '=bcc[{{$index}}].email',
										type: 'body',
									},
								},
								description: 'Email of the BCC receipient',
							},
						],
					},
				],
			},
			{
				displayName: 'Receipients CC',
				name: 'receipientsCC',
				placeholder: 'Add CC',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'receipientCc',
						displayName: 'Receipient',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								routing: {
									send: {
										property: '=cc[{{$index}}].name',
										type: 'body',
									},
								},
								description: 'Name of the CC receipient',
							},
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
								routing: {
									send: {
										property: '=cc[{{$index}}].email',
										type: 'body',
									},
								},
								description: 'Email of the CC receipient',
							},
						],
					},
				],
			},
		],
	},
];