// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CertificateRegistry {
    struct Certificate {
        address issuer;
        address recipient;
        string cid;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(bytes32 => Certificate) public certificates;

    event CertificateIssued(bytes32 indexed certificateId, address indexed issuer, address indexed recipient, string cid, uint256 issuedAt);
    event CertificateRevoked(bytes32 indexed certificateId, address indexed issuer, uint256 revokedAt);

    modifier onlyIssuer(bytes32 certificateId) {
        require(certificates[certificateId].issuer == msg.sender, "Not issuer");
        _;
    }

    function issueCertificate(bytes32 certificateId, address recipient, string calldata cid) external {
        require(certificates[certificateId].issuedAt == 0, "Already issued");
        certificates[certificateId] = Certificate({
            issuer: msg.sender,
            recipient: recipient,
            cid: cid,
            issuedAt: block.timestamp,
            revoked: false
        });
        emit CertificateIssued(certificateId, msg.sender, recipient, cid, block.timestamp);
    }

    function revokeCertificate(bytes32 certificateId) external onlyIssuer(certificateId) {
        require(certificates[certificateId].issuedAt != 0, "Not issued");
        certificates[certificateId].revoked = true;
        emit CertificateRevoked(certificateId, msg.sender, block.timestamp);
    }

    function verifyCertificate(bytes32 certificateId) external view returns (bool exists, bool valid, address issuer, address recipient, string memory cid, uint256 issuedAt) {
        Certificate storage c = certificates[certificateId];
        if (c.issuedAt == 0) {
            return (false, false, address(0), address(0), "", 0);
        }
        return (true, c.revoked == false, c.issuer, c.recipient, c.cid, c.issuedAt);
    }
}
