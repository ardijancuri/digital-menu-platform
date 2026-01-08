declare namespace Tremol {
	declare interface FP {
		timeStamp: number;
		/**
		 * Opens the cash drawer.
		 */
		CashDrawerOpen(): void;
		/**
		 * Paying the exact amount in cash and close the fiscal receipt.
		 */
		CashPayCloseReceipt(): void;
		/**
		 * Clears the external display.
		 */
		ClearDisplay(): void;
		/**
		 * Closes the non-fiscal receipt.
		 */
		CloseNonFiscReceipt(): void;
		/**
		 * Close the fiscal receipt (Fiscal receipt, Storno receipt, or Non-fical receipt). When the payment is finished.
		 */
		CloseReceipt(): void;
		/**
		 * Confirm storing VAT and ID numbers into the operative memory.
		 */
		ConfirmIDNumandVATnum(Password: string): void;
		/**
		 * Start paper cutter. The command works only in fiscal printer devices.
		 */
		CutPaper(): void;
		/**
		 * Executes the direct command .
		 */
		DirectCommand(Input: string): string;
		/**
		 * Shows the current date and time on the external display.
		 */
		DisplayDateTime(): void;
		/**
		 * Shows a 20-symbols text in the upper external display line.
		 */
		DisplayTextLine1(Text: string): void;
		/**
		 * Shows a 20-symbols text in the lower external display line.
		 */
		DisplayTextLine2(Text: string): void;
		/**
		 * Shows a 20-symbols text in the first line and last 20-symbols text in the second line of the external display lines.
		 */
		DisplayTextLines1and2(Text: string): void;
		/**
		 * Enter Service mode
		 */
		EnterServiceMode(OptionServiceMode: Tremol.Enums.OptionServiceMode, ServicePassword: string): void;
		/**
		 * Temporary enable/disable detailed receipts info sending
		 */
		ManageDetailedReceiptInfoSending(OptionActivationRS: Tremol.Enums.OptionActivationRS): void;
		/**
		 * Temporary enable/disable short receipts sending
		 */
		ManageShortReceiptSending(OptionActivationRS: Tremol.Enums.OptionActivationRS): void;
		/**
		 * Opens a non-fiscal receipt assigned to the specified operator
		 */
		OpenNonFiscalReceipt(OperNum: number, OperPass: string): void;
		/**
		 * Opens a fiscal receipt assigned to the specified operator
		 */
		OpenReceiptOrStorno(OperNum: number, OperPass: string, OptionReceiptType: Tremol.Enums.OptionReceiptType, OptionPrintType: Tremol.Enums.OptionPrintType): void;
		/**
		 * Feeds one line of paper.
		 */
		PaperFeed(): void;
		/**
		 * Register the payment in the receipt with specified type of payment and exact amount received.
		 */
		PayExactSum(OptionPaymentType: Tremol.Enums.OptionPaymentType): void;
		/**
		 * Registers the payment in the receipt with specified type of payment and amount received.
		 */
		Payment(OptionPaymentType: Tremol.Enums.OptionPaymentType, OptionChange: Tremol.Enums.OptionChange, Amount: number, OptionChangeType?: Tremol.Enums.OptionChangeType): void;
		/**
		 * Prints QR 2D code
		 */
		Print2DBarcode(Scale: string, CodeData: string): void;
		/**
		 * Prints an article report with or without zeroing ('Z' or 'X').
		 */
		PrintArticleReport(OptionZeroing: Tremol.Enums.OptionZeroing): void;
		/**
		 * Prints barcode from type stated by CodeType and CodeLen and with data stated in CodeData field.
		 */
		PrintBarcode(OptionCodeType: Tremol.Enums.OptionCodeType, CodeLen: number, CodeData: string, OptionCentering?: Tremol.Enums.OptionCentering): void;
		/**
		 * Print a brief FM report by initial and end date.
		 */
		PrintBriefFMReportByDate(StartDate: Date, EndDate: Date): void;
		/**
		 * Print a brief FM report by initial and end FM report number.
		 */
		PrintBriefFMReportByNum(StartNum: number, EndNum: number): void;
		/**
		 * Depending on the parameter prints:  − daily fiscal report with zeroing and fiscal memory record, preceded by Electronic Journal report print ('Z'); − daily fiscal report without zeroing ('X');
		 */
		PrintDailyReport(OptionZeroing: Tremol.Enums.OptionZeroing): void;
		/**
		 * Print a department report with or without zeroing ('Z' or 'X').
		 */
		PrintDepartmentReport(OptionZeroing: Tremol.Enums.OptionZeroing): void;
		/**
		 * Prints a detailed FM report by initial and end date.
		 */
		PrintDetailedFMReportByDate(StartDate: Date, EndDate: Date): void;
		/**
		 * Print a detailed FM report by initial and end FM report number.
		 */
		PrintDetailedFMReportByNum(StartNum: number, EndNum: number): void;
		/**
		 * Prints out a diagnostic receipt.
		 */
		PrintDiagnostics(): void;
		/**
		 * Print or store Electronic Journal report with all documents.
		 */
		PrintEJ(): void;
		/**
		 * Printing Electronic Journal Report from Report initial date to report Final date.
		 */
		PrintEJByDate(StartRepFromDate: Date, EndRepFromDate: Date): void;
		/**
		 * Printing Electronic Journal Report from receipt number to receipt number.
		 */
		PrintEJByReceiptNumFromZrep(ZrepNum: number, StartReceiptNum: number, EndReceiptNum: number): void;
		/**
		 * Printing Electronic Journal Report from receipt number to receipt number.
		 */
		PrintEJByStornoNumFromZrep(ZrepNum: string, StartReceiptNum: string, EndReceiptNum: string): void;
		/**
		 * Print or store Electronic Journal Report from by number of Z report blocks.
		 */
		PrintEJByZBlocks(StartZNum: number, EndZNum: number): void;
		/**
		 * Prints the programmed graphical logo with the stated number.
		 */
		PrintLogo(Number: number): void;
		/**
		 * Prints an operator's report for a specified operator (0 = all operators) with or without zeroing ('Z' or 'X'). When a 'Z' value is specified the report should include all operators.
		 */
		PrintOperatorReport(OptionZeroing: Tremol.Enums.OptionZeroing, Number: number): void;
		/**
		 * Print whole special FM events report.
		 */
		PrintSpecialEventsFMreport(): void;
		/**
		 * Print a free text. The command can be executed only if receipt is opened (Fiscal receipt, Storno receipt or Non-fical receipt). In the beginning and in the end of line symbol '#' is printed.
		 */
		PrintText(Text: string): void;
		/**
		 * Print a free text. The command can be executed only if receipt is opened (Fiscal receipt, Storno receipt or Non-fical receipt). In the beginning and in the end of line symbol '#' is printed.
		 */
		PrintTextBuffred(Text: string): void;
		/**
		 * Stores a block containing the number format into the fiscal memory. Print the current status on the printer.
		 */
		ProgDecimalPointPosition(Password: string, OptionDecimalPointPosition: Tremol.Enums.OptionDecimalPointPosition): void;
		/**
		 * Set data for the state department number from the internal FD database.
		 */
		ProgDepartment(Number: number, Name: string, OptionVATClass: Tremol.Enums.OptionVATClass, Price: number, FlagsPrice: string): void;
		/**
		 * Program the contents of a Display Greeting message.
		 */
		ProgDisplayGreetingMessage(DisplayGreetingText: string): void;
		/**
		 * Programs the external display.
		 */
		ProgExtDisplay(Password: string): void;
		/**
		 * Program the contents of a footer lines.
		 */
		ProgFooter(OptionFooterLine: Tremol.Enums.OptionFooterLine, FooterText: string): void;
		/**
		 * Program the contents of a header lines.
		 */
		ProgHeader(OptionHeaderLine: Tremol.Enums.OptionHeaderLine, HeaderText: string): void;
		/**
		 * Programs the operator's name and password.
		 */
		ProgOperator(Number: number, Name: string, Password: string): void;
		/**
		 * Programs the number of POS, printing of logo, cash drawer opening, cutting permission, external display management mode, article report type, enable or disable currency in receipt and working operators counter.
		 */
		ProgParameters(POSNum: number, OptionPrintLogo: Tremol.Enums.OptionPrintLogo, OptionAutoOpenDrawer: Tremol.Enums.OptionAutoOpenDrawer, OptionAutoCut: Tremol.Enums.OptionAutoCut, OptionExternalDispManagement: Tremol.Enums.OptionExternalDispManagement, OptionReceiptSend: Tremol.Enums.OptionReceiptSend, OptionEnableCurrency: Tremol.Enums.OptionEnableCurrency, OptionWorkOperatorCount: Tremol.Enums.OptionWorkOperatorCount): void;
		/**
		 * Program the name of the payment types.
		 */
		ProgPayment(OptionPaymentNum: Tremol.Enums.OptionPaymentNum, Name: string, Rate?: number): void;
		/**
		 * Program the Barcode number for a certain article (item) from the internal database.
		 */
		ProgPLUbarcode(PLUNum: number, Barcode: string): void;
		/**
		 * Programs the general data for a certain article in the internal FD database. The price may have variable length, while the name field is fixed.
		 */
		ProgPLUgeneral(PLUNum: string, PLUName: string, Price: number, FlagsPriceQty: string, BelongToDepNum: number, AvailableQuantity: number, Barcode: string): void;
		/**
		 * Program the price for a certain article from the internal database.
		 */
		ProgPLUprice(PLUNum: number, Price: number, OptionPrice: Tremol.Enums.OptionPrice): void;
		/**
		 * Programs available quantity and quantiy type for a certain article in the internal database.
		 */
		ProgPLUqty(PLUNum: number, AvailableQuantity: number, OptionQuantityType: Tremol.Enums.OptionQuantityType): void;
		/**
		 * Stores a block containing the values of the VAT rates into the fiscal memory. Print the values on the printer.
		 */
		ProgVATrates(Password: string, VATrate1: number, VATrate2: number, VATrate3: number, VATrate4: number): void;
		/**
		 *  Reads raw bytes from FP.
		 */
		RawRead(Count: number, EndChar: string): Uint8Array;
		/**
		 *  Writes raw bytes to FP 
		 */
		RawWrite(Bytes: Uint8Array): void;
		/**
		 * Provides information about device's Bluetooth password.
		 */
		ReadBluetooth_Password(): Bluetooth_PasswordRes;
		/**
		 * Providing information about if the device's Bluetooth module is enabled or disabled.
		 */
		ReadBluetooth_Status(): Tremol.Enums.OptionBTstatus;
		/**
		 * Read the current status of the receipt.
		 */
		ReadCurrentRecInfo(): CurrentRecInfoRes;
		/**
		 * Provides information about the total fiscal counters and last Z- report date and time.
		 */
		ReadDailyCounters(): DailyCountersRes;
		/**
		 * Read the last operator's report number and date and time.
		 */
		ReadDailyCountersByOperator(OperNum: number): DailyCountersByOperatorRes;
		/**
		 * Read the total number of customers, discounts, additions, corrections and accumulated amounts by specified operator.
		 */
		ReadDailyGeneralRegistersByOperator(OperNum: number): DailyGeneralRegistersByOperatorRes;
		/**
		 * Provides information about the PO amounts by type of payment and the total number of operations.
		 */
		ReadDailyPO(): DailyPORes;
		/**
		 * Provides information about the PO and the total number of operations by specified operator.
		 */
		ReadDailyPObyOperator(OperNum: number): DailyPObyOperatorRes;
		/**
		 * Provides information about the RA amounts by type of payment and the total number of operations.
		 */
		ReadDailyRA(): DailyRARes;
		/**
		 * Provides information about the RA and the total number of operations by specified operator.
		 */
		ReadDailyRAbyOperator(OperNum: number): DailyRAbyOperatorRes;
		/**
		 * Provides information about the amounts received from sales and Storno change.
		 */
		ReadDailyReceivedSalesAmounts(): DailyReceivedSalesAmountsRes;
		/**
		 * Read the amounts received from sales by type of payment and specified operator.
		 */
		ReadDailyReceivedSalesAmountsByOperator(OperNum: number): DailyReceivedSalesAmountsByOperatorRes;
		/**
		 * Provides information about the amounts returned as Storno or sales change.
		 */
		ReadDailyReturned(): DailyReturnedRes;
		/**
		 * Read information about the amounts returned
		 */
		ReadDailyReturnedAmounts(OperNum: number): DailyReturnedAmountsRes;
		/**
		 * Provides information about the accumulated amount by VAT group.
		 */
		ReadDailySaleAndStornoAmountsByVAT(): DailySaleAndStornoAmountsByVATRes;
		/**
		 * Provides information about the current date and time.
		 */
		ReadDateTime(): Date;
		/**
		 * Provides information about the current (the last value stored into the FM) decimal point format.
		 */
		ReadDecimalPoint(): Tremol.Enums.OptionDecimalPointPosition;
		/**
		 * Provides information for the programmed data, the turnover from the stated department number
		 */
		ReadDepartment(DepNum: number): DepartmentRes;
		/**
		 * Read info for enable/disable detailed receipts
		 */
		ReadDetailedReceiptInfoSending(): Tremol.Enums.OptionActivationRS;
		/**
		 * Provide an information about modules supported by the device
		 */
		ReadDeviceModuleSupport(): DeviceModuleSupportRes;
		/**
		 * Provide an information about modules supported by device's firmware
		 */
		ReadDeviceModuleSupportByFirmware(): DeviceModuleSupportByFirmwareRes;
		/**
		 * Provides information about device's DHCP status
		 */
		ReadDHCP_Status(): Tremol.Enums.OptionDhcpStatus;
		/**
		 * Provide information about the display greeting message.
		 */
		ReadDisplayGreetingMessage(): string;
		/**
		 * Read Electronic Journal report with all documents.
		 */
		ReadEJ(): void;
		/**
		 * Read Electronic Journal Report from Report initial date to report Final date.
		 */
		ReadEJByDate(StartRepFromDate: Date, EndRepFromDate: Date): void;
		/**
		 * Read Electronic Journal Report from receipt number to receipt number.
		 */
		ReadEJByReceiptNumFromZrep(ZrepNum: number, StartReceiptNum: number, EndReceiptNum: number): void;
		/**
		 * Read Electronic Journal Report from receipt number to receipt number.
		 */
		ReadEJByStornoNumFromZrep(ZrepNum: string, StartReceiptNum: string, EndReceiptNum: string): void;
		/**
		 * Read Electronic Journal Report from by number of Z report blocks.
		 */
		ReadEJByZBlocks(StartZNum: number, EndZNum: number): void;
		/**
		 * Select type of display
		 */
		ReadExternalDisplay(): Tremol.Enums.OptionExternalType;
		/**
		 * Provides consequently information about every single block stored in the FM starting with Acknowledgements and ending with end message.
		 */
		ReadFMcontent(): void;
		/**
		 * Read the number of the remaining free records for Z-report in the Fiscal Memory.
		 */
		ReadFMfreeRecords(): string;
		/**
		 * Provides the content of the footer lines.
		 */
		ReadFooter(OptionFooterLine: Tremol.Enums.OptionFooterLine): FooterRes;
		/**
		 * Provides information about the number of customers (number of fiscal receipt issued), number of discounts, additions and corrections made and the accumulated amounts.
		 */
		ReadGeneralDailyRegisters(): GeneralDailyRegistersRes;
		/**
		 * Provides information about device's GRPS APN.
		 */
		ReadGPRS_APN(): GPRS_APNRes;
		/**
		 * Provides information about device's GPRS password.
		 */
		ReadGPRS_Password(): GPRS_PasswordRes;
		/**
		 * Provides information about device's GPRS signal.
		 */
		ReadGPRS_Signal(): string;
		/**
		 * Provides information about device's GPRS username.
		 */
		ReadGPRS_Username(): GPRS_UsernameRes;
		/**
		 * Provides the content of the header lines.
		 */
		ReadHeader(OptionHeaderLine: Tremol.Enums.OptionHeaderLine): HeaderRes;
		/**
		 * Provides key for server address.
		 */
		ReadKeyServerAddress(): KeyServerAddressRes;
		/**
		 * Read date and number of last Z-report and last RAM reset event.
		 */
		ReadLastDailyReportInfo(): LastDailyReportInfoRes;
		/**
		 * Provides information about the number of the last issued receipt.
		 */
		ReadLastReceiptNum(): LastReceiptNumRes;
		/**
		 * Provides information about an operator's name and password.
		 */
		ReadOperatorNamePassword(Number: number): OperatorNamePasswordRes;
		/**
		 * Provides information about the programmed number of POS and the current values of the logo, cutting permission, display mode, enable/disable currency in receipt.
		 */
		ReadParameters(): ParametersRes;
		/**
		 * Provides information about all programmed payment types, currency name and exchange rate.
		 */
		ReadPayments(): PaymentsRes;
		/**
		 * Provides information about the barcode of the specified article.
		 */
		ReadPLUbarcode(PLUNum: number): PLUbarcodeRes;
		/**
		 * Provides information about the general registers of the specified.
		 */
		ReadPLUgeneral(PLUNum: number): PLUgeneralRes;
		/**
		 * Provides information about the price and price type of the specified article.
		 */
		ReadPLUprice(PLUNum: number): PLUpriceRes;
		/**
		 * Provides information about the quantity registers of the specified article.
		 */
		ReadPLUqty(PLUNum: number): PLUqtyRes;
		/**
		 * Provides information about register server address.
		 */
		ReadRegisterServerAddress(): RegisterServerAddressRes;
		/**
		 * Provides information about the owner's numbers and registration date time.
		 */
		ReadRegistrationInfo(): RegistrationInfoRes;
		/**
		 * Provides information about the manufacturing number of the fiscal device, FM number and ECR Unique number.
		 */
		ReadSerialAndFiscalNums(): SerialAndFiscalNumsRes;
		/**
		 * Provides information about server address.
		 */
		ReadServerAddress(): ServerAddressRes;
		/**
		 * Read Service mode status
		 */
		ReadServiceMode(): Tremol.Enums.OptionServiceMode;
		/**
		 * Read info for enable/disable short receipts
		 */
		ReadShortReceiptSending(): Tremol.Enums.OptionActivationRS;
		/**
		 * Provides detailed 7-byte information about the current status of the fiscal device.
		 */
		ReadStatus(): StatusRes;
		/**
		 * Provides information about device's IP address, subnet mask, gateway address, DNS address.
		 */
		ReadTCP_Addresses(OptionAddressType: Tremol.Enums.OptionAddressType): TCP_AddressesRes;
		/**
		 * Read device TCP Auto Start status
		 */
		ReadTCP_AutoStartStatus(): Tremol.Enums.OptionTCPAutoStart;
		/**
		 * Provides information about device's TCP password.
		 */
		ReadTCP_Password(): TCP_PasswordRes;
		/**
		 * Read the used TCP module for communication - Lan or WiFi
		 */
		ReadTCP_UsedModule(): Tremol.Enums.OptionUsedModule;
		/**
		 * Provides information about the total fiscal accumulative sums from sales and Storno
		 */
		ReadTotalFiscalSums(): TotalFiscalSumsRes;
		/**
		 * Provides information about the current VAT rates which are the last values stored into the FM.
		 */
		ReadVATrates(): VATratesRes;
		/**
		 * Provides information about the device type, model name and version.
		 */
		ReadVersion(): VersionRes;
		/**
		 * Read device's connected WiFi network name
		 */
		ReadWiFi_NetworkName(): WiFi_NetworkNameRes;
		/**
		 * Read device's connected WiFi network password
		 */
		ReadWiFi_Password(): WiFi_PasswordRes;
		/**
		 * Provides information about device's idle timeout. This timeout is seconds in which the connection will be closed when there is an inactivity. This information is available if the device has LAN or WiFi. Maximal value - 7200, minimal value 0. 0 is for never close the connection.
		 */
		Read_IdleTimeout(): number;
		/**
		 * Registers cash received on account or paid out.
		 */
		ReceivedOnAccount_PaidOut(OperNum: number, OperPass: string, Amount: number): void;
		/**
		 * After every change on Idle timeout, LAN/WiFi/GPRS usage, LAN/WiFi/TCP/GPRS password or TCP auto start networks settings this Save command needs to be execute.
		 */
		SaveNetworkSettings(): void;
		/**
		 * Scan and print all available WiFi networks
		 */
		ScanAndPrintWiFiNetworks(): void;
		/**
		 * Select type of display
		 */
		SelectExternalDisplay(OptionExternalDisplay: Tremol.Enums.OptionExternalDisplay): void;
		/**
		 * Register the sell of department. Correction is forbidden!
		 */
		SellPLUfromDep(NamePLU: string, DepNum: number, Price: number, OptionGoodsType: Tremol.Enums.OptionGoodsType, Quantity?: number, DiscAddP?: number, DiscAddV?: number): void;
		/**
		 * Register the sell with specified quantity of article from the internal FD database. Correction is forbidden!
		 */
		SellPLUFromFD_DB(OptionSign: Tremol.Enums.OptionSign, PLUNum: number, Price?: number, Quantity?: number, DiscAddP?: number, DiscAddV?: number): void;
		/**
		 * Register the sell of article with specified name, price, quantity, VAT class and/or discount/addition on the transaction. Correction is forbidden!
		 */
		SellPLUwithSpecifiedVAT(NamePLU: string, OptionVATClass: Tremol.Enums.OptionVATClass, Price: number, OptionGoodsType: Tremol.Enums.OptionGoodsType, Quantity?: number, DiscAddP?: number, DiscAddV?: number): void;
		/**
		 * Stores in the memory the graphic file under stated number. Prints information about loaded in the printer graphic files.
		 */
		SetActiveLogo(LogoNumber: string): void;
		/**
		 * Program device's Bluetooth password. To apply use - SaveNetworkSettings()
		 */
		SetBluetooth_Password(PassLength: number, Password: string): void;
		/**
		 * Program device's Bluetooth module to be enabled or disabled. To apply use -SaveNetworkSettings()
		 */
		SetBluetooth_Status(OptionBTstatus: Tremol.Enums.OptionBTstatus): void;
		/**
		 * Sets the date and time and prints out the current values.
		 */
		SetDateTime(DateTime: Date): void;
		/**
		 * Program device's network IP address, subnet mask, gateway address, DNS address. To apply use -SaveNetworkSettings()
		 */
		SetDeviceTCP_Addresses(OptionAddressType: Tremol.Enums.OptionAddressType, DeviceAddress: string): void;
		/**
		 * Program device's TCP network DHCP enabled or disabled. To apply use -SaveNetworkSettings()
		 */
		SetDHCP_Enabled(OptionDHCPEnabled: Tremol.Enums.OptionDHCPEnabled): void;
		/**
		 * Programs key of server address.
		 */
		SetFiscalServerAddress(ParamLength: number, Address: string): void;
		/**
		 * Program device's GPRS APN. To apply use - SaveNetworkSettings()
		 */
		SetGPRS_APN(GPRS_APN_Len: number, APN: string): void;
		/**
		 * Program device's GPRS password. To apply use - SaveNetworkSettings()
		 */
		SetGPRS_Password(PassLength: number, Password: string): void;
		/**
		 * Program device's GPRS user name. To apply use - SaveNetworkSettings()
		 */
		SetGPRS_Username(GPRS_Username_Len: number, Username: string): void;
		/**
		 * Stores the VAT and ID numbers into the operative memory.
		 */
		SetIDandVATnum(Password: string, IDNum: string, VATNum: string): void;
		/**
		 * Sets device's idle timeout setting. Set timeout for closing the connection if there is an inactivity. Maximal value - 7200, minimal value 0. 0 is for never close the connection. This option can be used only if the device has LAN or WiFi. To apply use - SaveNetworkSettings()
		 */
		SetIdle_Timeout(IdleTimeout: number): void;
		/**
		 * Programs register server address.
		 */
		SetRegisterServerAddress(ParamLength: number, Address: string): void;
		/**
		 * Provides information about server address.
		 */
		SetServerAddress(ParamLength: number, Address: string): void;
		/**
		 * Program device's TCP password. To apply use - SaveNetworkSettings()
		 */
		SetTCPpassword(PassLength: number, Password: string): void;
		/**
		 * Sets the used TCP module for communication - Lan or WiFi. To apply use -SaveNetworkSettings()
		 */
		SetTCP_ActiveModule(OptionUsedModule: Tremol.Enums.OptionUsedModule): void;
		/**
		 * Set device's TCP autostart . To apply use -SaveNetworkSettings()
		 */
		SetTCP_AutoStart(OptionTCPAutoStart: Tremol.Enums.OptionTCPAutoStart): void;
		/**
		 * Program device's WiFi network name where it will connect. To apply use -SaveNetworkSettings()
		 */
		SetWiFi_NetworkName(WiFiNameLength: number, WiFiNetworkName: string): void;
		/**
		 * Program device's WiFi network password where it will connect. To apply use -SaveNetworkSettings()
		 */
		SetWiFi_Password(PassLength: number, Password: string): void;
		/**
		 * Start Bluetooth test on the device and print out the result
		 */
		StartTest_Bluetooth(): void;
		/**
		 * Start GPRS test on the device and print out the result
		 */
		StartTest_GPRS(): void;
		/**
		 * Start LAN test on the device and print out the result
		 */
		StartTest_Lan(): void;
		/**
		 * Start WiFi test on the device and print out the result
		 */
		StartTest_WiFi(): void;
		/**
		 * Calculate the subtotal amount with printing and display visualization options. Provide information about values of the calculated amounts. If a percent or value discount/addition has been specified the subtotal and the discount/addition value will be printed regardless the parameter for printing.
		 */
		Subtotal(OptionPrinting: Tremol.Enums.OptionPrinting, OptionDisplay: Tremol.Enums.OptionDisplay, DiscAddV?: number, DiscAddP?: number): number;
		/**
		 * Removes all paired devices. To apply use -SaveNetworkSettings()
		 */
		UnpairAllDevices(): void;
	}

	declare namespace Enums {
		declare enum OptionServiceMode {
			Sales_mode = '0',
			Service_mode = '1',
		}
		declare enum OptionActivationRS {
			No = '0',
			Yes = '1',
		}
		declare enum OptionReceiptType {
			Sale = '1',
			Storno = '0',
		}
		declare enum OptionPrintType {
			Postponed_printing = '2',
			Step_by_step_printing = '0',
		}
		declare enum OptionPaymentType {
			Card = '1',
			Cash = '0',
			Credit = '3',
			Currency = '4',
			Voucher = '2',
		}
		declare enum OptionChange {
			With_Change = '0',
			Without_Change = '1',
		}
		declare enum OptionChangeType {
			Change_In_Cash = '0',
			Change_In_Currency = '2',
			Same_As_The_payment = '1',
		}
		declare enum OptionZeroing {
			Without_zeroing = 'X',
			Zeroing = 'Z',
		}
		declare enum OptionCodeType {
			CODABAR = '6',
			CODE_128 = 'I',
			CODE_39 = '4',
			CODE_93 = 'H',
			EAN_13 = '2',
			EAN_8 = '3',
			ITF = '5',
			UPC_A = '0',
			UPC_E = '1',
		}
		declare enum OptionCentering {
			No = '0',
			Yes = '1',
		}
		declare enum OptionDecimalPointPosition {
			Fractions = '2',
			Whole_numbers = '0',
		}
		declare enum OptionVATClass {
			VAT_Class_0 = 'А',
			VAT_Class_1 = 'Б',
			VAT_Class_2 = 'В',
			VAT_Class_3 = 'Г',
		}
		declare enum OptionFooterLine {
			Footer_1 = 'F1',
			Footer_2 = 'F2',
			Footer_3 = 'F3',
		}
		declare enum OptionHeaderLine {
			Header_1 = '1',
			Header_2 = '2',
			Header_3 = '3',
			Header_4 = '4',
			Header_5 = '5',
			Header_6 = '6',
			ID_number = '7',
			VAT_number = '8',
		}
		declare enum OptionPrintLogo {
			No = '0',
			Yes = '1',
		}
		declare enum OptionAutoOpenDrawer {
			No = '0',
			Yes = '1',
		}
		declare enum OptionAutoCut {
			No = '0',
			Yes = '1',
		}
		declare enum OptionExternalDispManagement {
			Auto = '0',
			Manual = '1',
		}
		declare enum OptionReceiptSend {
			Automatic_sending = '1',
			Without_sending = '0',
		}
		declare enum OptionEnableCurrency {
			No = '0',
			Yes = '1',
		}
		declare enum OptionWorkOperatorCount {
			More = '0',
			One = '1',
		}
		declare enum OptionPaymentNum {
			Payment_1 = '1',
			Payment_2 = '2',
			Payment_3 = '3',
			Payment_4 = '4',
		}
		declare enum OptionPrice {
			Free_price_is_disable_valid_only_programmed_price = '0',
			Free_price_is_enable = '1',
			Limited_price = '2',
		}
		declare enum OptionQuantityType {
			Availability_of_PLU_stock_is_not_monitored = '0',
			Disable_negative_quantity = '1',
			Enable_negative_quantity = '2',
		}
		declare enum OptionBTstatus {
			Disabled = '0',
			Enabled = '1',
		}
		declare enum OptionIsReceiptOpened {
			No = '0',
			Yes = '1',
		}
		declare enum OptionInitiatedPayment {
			initiated_payment = '1',
			not_initiated_payment = '0',
		}
		declare enum OptionFinalizedPayment {
			finalized_payment = '1',
			not_finalized_payment = '0',
		}
		declare enum OptionPowerDownInReceipt {
			No = '0',
			Yes = '1',
		}
		declare enum OptionLAN {
			No = '0',
			Yes = '1',
		}
		declare enum OptionWiFi {
			No = '0',
			Yes = '1',
		}
		declare enum OptionGPRS {
			No = '0',
			Yes = '1',
		}
		declare enum OptionBT {
			No = '0',
			Yes = '1',
		}
		declare enum OptionDhcpStatus {
			Disabled = '0',
			Enabled = '1',
		}
		declare enum OptionExternalType {
			Others = '0',
			Tremol_display = '1',
		}
		declare enum OptionAddressType {
			DNS_address = '5',
			Gateway_address = '4',
			IP_address = '2',
			Subnet_Mask = '3',
		}
		declare enum OptionTCPAutoStart {
			No = '0',
			Yes = '1',
		}
		declare enum OptionUsedModule {
			LAN = '1',
			WiFi = '2',
		}
		declare enum OptionDeviceType {
			ECR = '1',
			FPr = '2',
		}
		declare enum OptionExternalDisplay {
			Others = '0',
			Tremol_display = '1',
		}
		declare enum OptionGoodsType {
			importation = '0',
			macedonian_goods = '1',
		}
		declare enum OptionSign {
			Sale = '+',
		}
		declare enum OptionDHCPEnabled {
			Disabled = '0',
			Enabled = '1',
		}
		declare enum OptionPrinting {
			No = '0',
			Yes = '1',
		}
		declare enum OptionDisplay {
			No = '0',
			Yes = '1',
		}
	}
}