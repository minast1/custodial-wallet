import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { NetworkOptions } from "./NetworkOptions";
import { SquareArrowLeft } from "lucide-react";
import { getAddress } from "viem";
import { Address } from "viem";
import { useDisconnect } from "wagmi";
import {
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon, // EyeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar, isENS } from "~~/components/scaffold-eth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger, //DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~~/components/ui/dropdown-menu";
import { useCopyToClipboard, useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

//const BURNER_WALLET_ID = "burnerWallet";

const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink,
}: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect();
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const checkSumAddress = getAddress(address);
  const router = useRouter();
  const { copyToClipboard: copyAddressToClipboard, isCopiedToClipboard: isAddressCopiedToClipboard } =
    useCopyToClipboard();
  const [selectingNetwork] = useState(false);
  const networkColor = useNetworkColor();
  const handleDisconnect = () => {
    disconnect();
    //setIsConnected(false);
    localStorage.removeItem("isWalletConnected");

    router.push("/");
  };

  return (
    <>
      {/* <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
        <summary className="btn btn-secondary btn-sm pl-0 pr-2 shadow-md dropdown-toggle gap-0 h-auto!">
          <BlockieAvatar address={checkSumAddress} size={30} ensImage={ensAvatar} />
          <span className="ml-2 mr-1">
            {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
          </span>
          <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
        </summary>
        <ul className="dropdown-content menu z-2 p-2 mt-2 shadow-center shadow-accent bg-base-200 rounded-box gap-1">
          <NetworkOptions hidden={!selectingNetwork} />
          <li className={selectingNetwork ? "hidden" : ""}>
            <div
              className="h-8 btn-sm rounded-xl! flex gap-3 py-3 cursor-pointer"
              onClick={() => copyAddressToClipboard(checkSumAddress)}
            >
              {isAddressCopiedToClipboard ? (
                <>
                  <CheckCircleIcon className="text-xl font-normal h-6 w-4 ml-2 sm:ml-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">Copied!</span>
                </>
              ) : (
                <>
                  <DocumentDuplicateIcon className="text-xl font-normal h-6 w-4 ml-2 sm:ml-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">Copy address</span>
                </>
              )}
            </div>
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <label htmlFor="qrcode-modal" className="h-8 btn-sm rounded-xl! flex gap-3 py-3">
              <QrCodeIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <span className="whitespace-nowrap">View QR Code</span>
            </label>
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <button className="h-8 btn-sm rounded-xl! flex gap-3 py-3" type="button">
              <ArrowTopRightOnSquareIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <a
                target="_blank"
                href={blockExplorerAddressLink}
                rel="noopener noreferrer"
                className="whitespace-nowrap"
              >
                View on Block Explorer
              </a>
            </button>
          </li>
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className="h-8 btn-sm rounded-xl! flex gap-3 py-3"
                type="button"
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Switch Network</span>
              </button>
            </li>
          ) : null}
          {connector?.id === BURNER_WALLET_ID ? (
            <li>
              <label htmlFor="reveal-burner-pk-modal" className="h-8 btn-sm rounded-xl! flex gap-3 py-3 text-error">
                <EyeIcon className="h-6 w-4 ml-2 sm:ml-0" />
                <span>Reveal Private Key</span>
              </label>
            </li>
          ) : null}
          <li className={selectingNetwork ? "hidden" : ""}>
            <button
              className="menu-item text-error h-8 btn-sm rounded-xl! flex gap-3 py-3"
              type="button"
              onClick={() => disconnect()}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Disconnect</span>
            </button>
          </li>
        </ul>
      </details> */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="p-2 py-0 bg-background/10 h-10 w-fit flex items-center border rounded-lg">
          <div className="w-3 h-3 rounded-full animate-pulse mr-2" style={{ backgroundColor: networkColor }} />
          <BlockieAvatar address={checkSumAddress} size={23} ensImage={ensAvatar} />
          <span className="ml-2 mr-1 text-sm font-semibold">
            {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
          </span>
          <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={e => {
              e.preventDefault();
              copyAddressToClipboard(checkSumAddress);
            }}
            className={selectingNetwork ? "hidden" : ""}
          >
            {isAddressCopiedToClipboard ? (
              <>
                <CheckCircleIcon className="text-xl font-normal h-6 w-4 ml-2 sm:ml-0" aria-hidden="true" />
                <span className="whitespace-nowrap">Copied!</span>
              </>
            ) : (
              <>
                <DocumentDuplicateIcon className="text-xl font-normal h-6 w-4 ml-2 sm:ml-0" aria-hidden="true" />
                <span className="whitespace-nowrap">Copy address</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuItem className="w-full hover:bg-transparent" onSelect={() => setShowQrCodeModal(true)}>
              <QrCodeIcon className="h-6 w-4 sm:ml-0" />
              View QR Code
            </DropdownMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem className={selectingNetwork ? "hidden" : ""}>
            <ArrowTopRightOnSquareIcon className="h-6 w-4 ml-2 sm:ml-0" />
            <a target="_blank" href={blockExplorerAddressLink} rel="noopener noreferrer" className="whitespace-nowrap">
              View on Block Explorer
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {allowedNetworks.length > 1 ? (
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="text-sm"
                  // onSelect={() => {
                  //   setSelectingNetwork(true);
                  // }}
                >
                  <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
                  Switch Network
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="mr-2">
                    <NetworkOptions />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          ) : null}

          <DropdownMenuItem onSelect={handleDisconnect} className={selectingNetwork ? "hidden" : ""}>
            <SquareArrowLeft className="h-6 w-4 ml-2 sm:ml-0" /> Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddressQRCodeModal address={address} onOpenChange={setShowQrCodeModal} open={showQrCodeModal} />
    </>
  );
};
